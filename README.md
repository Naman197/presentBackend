# Prism – Automated Confidence Evaluation System

**Prism** is an AI-powered, modular platform designed to assess human confidence through multi-modal analysis of **audio**, **video**, **body language**, and **content**. Built with scalability and customization in mind, Prism is aimed at enhancing interview assessments, public speaking evaluations, and presentation preparations using advanced ML and NLP models.

---

## 🚀 Project Repositories

### 🔹 [PresentBackend](https://github.com/Naman197/presentBackend)
**Repository URL**: [https://github.com/Naman197/presentBackend](https://github.com/Naman197/presentBackend)

This backend service handles event creation, user submissions, data extraction, and orchestration across the Prism system. It supports customization of evaluation based on organizational roles and culture.

### 🔹 [CSVDecoder](https://github.com/Naman197/csvdecoder)
**Repository URL**: [https://github.com/Naman197/csvdecoder](https://github.com/Naman197/csvdecoder)

This module is responsible for parsing and decoding CSV files related to extracted data and evaluation metrics. It ensures structured handling of skeletal and audio features for downstream analysis.

### 🔹 [FactChecker](https://github.com/Naman197/factchecker)
**Repository URL**: [https://github.com/Naman197/factchecker](https://github.com/Naman197/factchecker)

Uses LLMs to analyze the factual accuracy and relevance of spoken or presented content. This ensures content validation as part of the overall confidence score.

---

## 🧠 Key Features

- **Multi-Modal Analysis**: Simultaneously analyzes visual, audio, skeletal, and textual inputs
- **Confidence Scoring**: Provides a consolidated confidence score alongside detailed sub-scores
- **Fact-Checking**: Evaluates the authenticity of the spoken content using fine-tuned LLMs
- **Customization**: Supports role-specific assessments via custom configurations
- **Scalability**: Modular design ensures ease of integration with existing enterprise solutions
- **Open Source Tech Stack**: Leverages open tools and frameworks for transparency and adaptability

---

## ⚙️ Tech Stack

- **Frontend**: React.js, Tailwind CSS *(if any, based on future expansion)*
- **Backend**: Node.js, Express.js
- **AI/ML Models**: Gemini Flash2.5, LLaMA (for NLP), OpenCV, MediaPipe, Librosa (for AV processing)
- **Programming Languages**: Python (for ML/AI processing), JavaScript/Node.js (for backend services)
- **Database**: MongoDB
- **DevOps**: GitHub Actions *(for CI/CD pipeline management)*

---

## 🔄 Evaluation Workflow

1. **Event Creation**: Evaluators create an event with specifications
2. **Submission**: Candidates upload videos and optional documents
3. **Data Extraction**: Audio, skeletal, and visual features are extracted
4. **Feature Analysis**:
   - **Audio**: Pitch, MFCCs, speech rate, pauses
   - **Visual**: Head movement, posture, gestures
   - **Textual**: Transcript and document relevance & correctness
5. **Scoring & Reporting**:
   - Confidence score
   - Content accuracy
   - Comprehensive, explainable insights

---

## 🌐 Real-World Applications

- Automated recruitment and talent screening
- Public speaking and leadership development
- Customized employee training assessments
- RAG-based (Retrieval-Augmented Generation) integrations for enterprise use

---

## 📉 Challenges

- Dataset curation for accurate modeling
- Trust-building for enterprise-grade automation
- Lack of benchmarks in nuanced human confidence modeling

---

## 📎 Future Plans

- Real-time feedback mechanisms via browser extensions
- Integration with AR/VR and robotics for immersive applications
- Expanded model training using fine-tuned behavioral datasets

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
