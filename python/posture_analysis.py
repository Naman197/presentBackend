import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import signal
import time
import argparse
from collections import deque

# Enhanced MediaPipe configuration
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

class OneEuroFilter:
    """Improved implementation of 1€ Filter for landmark smoothing"""
    def __init__(self, freq=30, mincutoff=1.0, beta=0.1, dcutoff=1.0):
        self.beta = beta
        self.mincutoff = mincutoff
        self.dcutoff = dcutoff
        self.freq = freq
        self.x_prev = None
        self.dx_prev = None
        self.t_prev = time.time()
        
    def smoothing_factor(self, t_e, cutoff):
        r = 2 * np.pi * cutoff * t_e
        return r / (r + 1)

    def __call__(self, x):
        t = time.time()
        t_e = t - self.t_prev if self.t_prev else 1/self.freq
        
        if self.x_prev is None:
            self.x_prev = x
            self.dx_prev = np.zeros_like(x)
            self.t_prev = t
            return x
            
        # Smoothing factor for derivative
        a_d = self.smoothing_factor(t_e, self.dcutoff)
        dx = (x - self.x_prev) / t_e
        dx_hat = a_d * dx + (1 - a_d) * self.dx_prev
        
        # Adaptive cutoff frequency
        cutoff = self.mincutoff + self.beta * np.abs(dx_hat)
        a = self.smoothing_factor(t_e, cutoff)
        
        # Filtered value
        x_hat = a * x + (1 - a) * self.x_prev
        
        # Update state
        self.x_prev = x_hat
        self.dx_prev = dx_hat
        self.t_prev = t
        
        return x_hat

class PostureAnalyzer:
    """Professional posture analysis system with adaptive thresholds"""
    def __init__(self):
        self.pose = mp_pose.Pose(
            static_image_mode=False,
            model_complexity=2,
            enable_segmentation=True,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        # FIX: Matching filter keys with feature extraction keys
        self.filters = {
            'shoulder_alignment': OneEuroFilter(beta=0.7),
            'head_position': OneEuroFilter(beta=0.5),
            'spine_angle': OneEuroFilter(beta=0.6),
            'arm_openness': OneEuroFilter(beta=0.4)
        }
        self.history = deque(maxlen=30)  # For dynamic threshold calculation
        self.feature_weights = {
            'shoulder_alignment': 0.3,
            'head_position': 0.25,
            'spine_angle': 0.3,
            'arm_openness': 0.15
        }

    def process_frame(self, image):
        """Process video frame with enhanced stabilization"""
        if image is None:
            return None, None
            
        # Convert image to RGB for MediaPipe
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb_image)
        
        if not results.pose_landmarks:
            return None, None
            
        # Extract and smooth landmarks + visibilities
        raw_features = self._extract_features(results.pose_landmarks)
        
        # Apply smoothing filters for numerical features only
        smoothed_features = {}
        for k, v in raw_features.items():
            if k in self.filters:
                smoothed_features[k] = self.filters[k](v)
            else:
                smoothed_features[k] = v
        
        # Analyze the posture
        analysis_result = self.analyze_posture(smoothed_features)
        return analysis_result, results.pose_landmarks

    def _extract_features(self, landmarks):
        """Enhanced feature extraction with anatomical validation plus visibility checks"""
        coords = {}
        vis = {}
        for idx, lm in enumerate(landmarks.landmark):
            coords[idx] = (lm.x, lm.y)
            vis[idx] = lm.visibility
        
        # Shoulder alignment (vertical difference)
        ls = coords[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        rs = coords[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        shoulder_align = abs(ls[1] - rs[1]) * 2  # Magnify vertical difference
        
        # Head position relative to shoulders
        nose = coords[mp_pose.PoseLandmark.NOSE.value]
        mid_shoulder = ((ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2)
        head_pos = nose[1] - mid_shoulder[1]
        
        # Spine angle calculation
        lh = coords[mp_pose.PoseLandmark.LEFT_HIP.value]
        rh = coords[mp_pose.PoseLandmark.RIGHT_HIP.value]
        mid_hip = ((lh[0] + rh[0]) / 2, (lh[1] + rh[1]) / 2)
        spine_angle = self._calculate_angle(mid_shoulder, mid_hip, (mid_hip[0], mid_hip[1] + 0.1))
        
        # Arm openness with normalization
        lw = coords[mp_pose.PoseLandmark.LEFT_WRIST.value]
        rw = coords[mp_pose.PoseLandmark.RIGHT_WRIST.value]
        shoulder_width = max(0.1, abs(ls[0] - rs[0]))  # Prevent division by zero
        arm_open = abs(lw[0] - rw[0]) / shoulder_width
        
        # Include visibilities for shoulders and nose
        left_shoulder_vis = vis[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        right_shoulder_vis = vis[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        nose_vis = vis[mp_pose.PoseLandmark.NOSE.value]
        
        features = {
            'shoulder_alignment': shoulder_align,
            'head_position': head_pos,
            'spine_angle': spine_angle,
            'arm_openness': arm_open,
            'left_shoulder_vis': left_shoulder_vis,
            'right_shoulder_vis': right_shoulder_vis,
            'nose_vis': nose_vis
        }
        return features

    def _calculate_angle(self, a, b, c):
        """Robust angle calculation with error handling"""
        try:
            a = np.array(a)
            b = np.array(b)
            c = np.array(c)
            
            ba = a - b
            bc = c - b
            
            dot_product = np.dot(ba, bc)
            norm_ba = np.linalg.norm(ba)
            norm_bc = np.linalg.norm(bc)
            
            if norm_ba == 0 or norm_bc == 0:
                return 90.0
                
            cosine = dot_product / (norm_ba * norm_bc)
            angle = np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0)))
            return angle
        except Exception as e:
            print(f"Angle calculation error: {e}")
            return 90.0

    def analyze_posture(self, features):
        """Adaptive confidence scoring with dynamic thresholds and visibility adjustments"""
        self.history.append(features)
        
        if len(self.history) < 5:
            baseline = {
                'shoulder_alignment': 0.05,
                'head_position': -0.05,
                'spine_angle': 160,
                'arm_openness': 0.3
            }
        else:
            df = pd.DataFrame(self.history)
            baseline = df.quantile(0.7).to_dict()
        
        scores = {}
        threshold = max(0.05, baseline['shoulder_alignment'] * 1.2)
        scores['shoulder_alignment'] = 100 * (1 - min(features['shoulder_alignment'] / threshold, 1))
        
        threshold = min(-0.03, baseline['head_position'])
        normalized = (features['head_position'] - threshold) / (0.1 - threshold)
        scores['head_position'] = 100 * (1 - min(max(normalized, 0), 1))
        
        threshold = max(150, baseline['spine_angle'] * 0.9)
        normalized = (features['spine_angle'] - 120) / (threshold - 120)
        scores['spine_angle'] = 100 * min(max(normalized, 0), 1)
        
        threshold = max(0.3, baseline['arm_openness'] * 0.8)
        normalized = features['arm_openness'] / threshold
        scores['arm_openness'] = 100 * min(normalized, 1)
        
        confidence = 0
        for k in scores:
            if k in self.feature_weights:
                confidence += scores[k] * self.feature_weights[k]
        
        # Adjust confidence based on landmark visibility
        left_shoulder_vis = features.get('left_shoulder_vis', 1)
        right_shoulder_vis = features.get('right_shoulder_vis', 1)
        nose_vis = features.get('nose_vis', 1)
        
        if left_shoulder_vis < 0.7 and right_shoulder_vis < 0.7:
            confidence *= 0.4
        if nose_vis < 0.7:
            confidence *= 0.4
        
        feedback = {
            'Shoulders': ('Excellent' if scores['shoulder_alignment'] > 80 else 
                         'Good' if scores['shoulder_alignment'] > 70 else 'Needs improvement'),
            'Head': ('Confident' if scores['head_position'] > 90 else 
                    'Neutral' if scores['head_position'] > 80 else 'Low confidence'),
            'Spine': ('Straight' if scores['spine_angle'] > 90 else 
                     'Good' if scores['spine_angle'] > 80 else 'Hunched'),
            'Arms': ('Open' if scores['arm_openness'] > 90 else 
                    'Neutral' if scores['arm_openness'] > 80 else 'Closed')
        }
        
        return confidence, feedback, scores

def analyze_video(input_path, output_path=None):
    """Professional video analysis pipeline with reporting"""
    analyzer = PostureAnalyzer()
    
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file '{input_path}'")
        return
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    
    writer = None
    if output_path:
        if frame_size[0] <= 0 or frame_size[1] <= 0:
            frame_size = (1280, 720)
            
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        writer = cv2.VideoWriter(output_path, fourcc, fps, frame_size)
    
    timestamps = []
    confidence_scores = []
    detailed_scores = []
    
    print(f"Analyzing video: {input_path}")
    print(f"FPS: {fps}, Size: {frame_size}")
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        frame_count += 1
        
        try:
            result, landmarks = analyzer.process_frame(frame)
            if not result:
                continue
                
            confidence, feedback, scores = result
            
            time_sec = frame_count / fps
            timestamps.append(time_sec)
            confidence_scores.append(confidence)
            detailed_scores.append(scores)
            
            viz_frame = frame.copy()
            
            if landmarks:
                mp_drawing.draw_landmarks(
                    viz_frame,
                    landmarks,
                    mp_pose.POSE_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=3, circle_radius=5),
                    mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=3)
                )
            
            cv2.putText(viz_frame, f"Confidence: {confidence:.1f}%", (20, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0,200,0), 2)
            
            y_offset = 80
            for aspect, status in feedback.items():
                cv2.putText(viz_frame, f"{aspect}: {status}", (20, y_offset),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)
                y_offset += 40
            
            if writer:
                writer.write(viz_frame)
                
            cv2.imshow('Posture Analysis', viz_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        except Exception as e:
            print(f"Error processing frame {frame_count}: {e}")
            continue
            
    cap.release()
    if writer:
        writer.release()
    cv2.destroyAllWindows()
    
    if len(confidence_scores) < 5:
        print("Not enough data collected for analysis. Check if pose detection is working properly.")
        return
    
    generate_report(timestamps, confidence_scores, detailed_scores)
    print("Analysis complete!")

def generate_report(timestamps, confidence, detail_scores):
    """Professional reporting with advanced analytics"""
    df = pd.DataFrame({
        'timestamp': timestamps,
        'confidence': confidence
    })
    
    for key in detail_scores[0].keys():
        df[key] = [s[key] for s in detail_scores]
    
    window_size = min(len(df), 15)
    if window_size % 2 == 0:
        window_size -= 1
    
    if window_size >= 3:
        try:
            df['smoothed'] = signal.savgol_filter(df['confidence'], window_size, 3)
        except Exception:
            df['smoothed'] = df['confidence']
    else:
        df['smoothed'] = df['confidence']
    
    plt.figure(figsize=(16, 12))
    
    plt.subplot(2, 2, 1)
    plt.plot(df['timestamp'], df['confidence'], 'b-', alpha=0.3, label='Raw')
    plt.plot(df['timestamp'], df['smoothed'], 'r-', linewidth=2, label='Smoothed')
    plt.title('Confidence Trend Analysis')
    plt.xlabel('Time (s)')
    plt.ylabel('Confidence Score')
    plt.ylim(0, 100)
    plt.grid(True)
    plt.legend()
    
    plt.subplot(2, 2, 2)
    features = ['shoulder_alignment', 'head_position', 'spine_angle', 'arm_openness']
    if len(df) >= 10:
        try:
            df[features].plot.kde(ax=plt.gca())
            plt.title('Feature Distribution Analysis')
            plt.xlim(0, 100)
            plt.grid(True)
        except Exception:
            plt.title('Not enough data for KDE')
    else:
        plt.title('Not enough data for distribution analysis')
    
    plt.subplot(2, 2, 3)
    corr = df[features].corr()
    plt.imshow(corr, cmap='coolwarm', vmin=-1, vmax=1)
    plt.colorbar()
    plt.xticks(range(len(features)), features, rotation=45)
    plt.yticks(range(len(features)), features)
    plt.title('Feature Correlation Matrix')
    
    plt.subplot(2, 2, 4)
    plt.hist(df['confidence'], bins=min(20, len(df)//5 + 1), edgecolor='black')
    plt.title('Confidence Score Distribution')
    plt.xlabel('Confidence Score')
    plt.ylabel('Frequency')
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig('advanced_analysis_report.png', dpi=300)
    plt.close()
    
    df.to_csv('posture_analysis_data.csv', index=False)
    print("Report generated: advanced_analysis_report.png")
    print("Raw data saved: posture_analysis_data.csv")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Professional Posture Analysis')
    parser.add_argument('-i', '--input', required=True, help='Input video file path')
    parser.add_argument('-o', '--output', help='Output video file path')
    args = parser.parse_args()
    
    analyze_video(args.input, args.output)