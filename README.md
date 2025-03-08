# Cataract Detection System 👁️⚕️  
**AI-powered eye disease diagnosis platform**  
*https://github.com/ibrahim-wael-ibrahim/Cataract*

[![Flask](https://img.shields.io/badge/Flask-2.2.5-green)](https://flask.palletsprojects.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.3-blue)](https://nextjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15.0-orange)](https://www.tensorflow.org/)

![System Architecture](./docs/architecture.png) <!-- Replace with actual path -->

A full-stack medical imaging platform for early cataract detection using deep learning.

## Key Features ✨

| Patient Features            | Doctor Features             | Admin Features              |
|-----------------------------|-----------------------------|-----------------------------|
| AI Image Analysis 📸         | Profile Management 👨💼     | User Management 👥          |
| Diagnosis History 📅         | Patient Insights 🔍         | System Monitoring 📊        |
| Doctor Search 🗺️            | Consultation Interface 💬   | Content Management ⚙️       |

## Technology Stack 🛠️

**AI & Backend**  
`Python 3.10` · `Flask` · `TensorFlow/Keras` · `OpenCV` · `MySQL` · `Docker`

**Frontend**  
`Next.js 14` · `Tailwind CSS` · `React Context` · `Lucide Icons` · `Chart.js`

## Installation Guide 📥

# Clone repository
```
git clone https://github.com/ibrahim-wael-ibrahim/Cataract.git
cd Cataract
```

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run --port=5000

# Frontend setup (in new terminal)
```
cd ../frontend
npm install
npm run dev
```

## Configuration ⚙️

`backend/.env`
```ini
DATABASE_URL=mysql+pymysql://user:password@localhost/cataract_db
JWT_SECRET_KEY=your_secure_key_here
UPLOAD_FOLDER=./upload
MODEL_PATH=./routes/model.h5
```

## API Documentation 📚

| Endpoint          | Method | Auth Required | Description                 |
|-------------------|--------|---------------|-----------------------------|
| `/api/login`      | POST   | No            | User authentication        |
| `/api/predict`    | POST   | Yes           | Image analysis endpoint    |
| `/api/history`    | GET    | Yes           | Get diagnosis history      |
| `/api/doctors`    | GET    | Optional      | Search medical professionals |

## Contributing 🤝

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add awesome feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open pull request

**Before contributing:**
- Read our [Code of Conduct](CODE_OF_CONDUCT.md)
- Check [GitHub Issues](https://github.com/ibrahim-wael-ibrahim/Cataract/issues)

## License 📄

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgements 🙏

- Kaggle for eye disease datasets
- Google Colab for GPU resources
- Future Academy mentors
- TensorFlow community

---

**Need Help?**  
✉️ Open an issue or contact ibrahim.wael@example.com  
📚 Visit our [Documentation Site](https://cataract-docs.example.com)

**To use this:**
1. Copy all content between the triple backticks
2. Paste into your README.md file
3. Replace placeholder values (architecture.png, email, docs link)
4. Add actual architecture diagram at `/docs/architecture.png`
5. Customize database credentials in `.env` section

Let me know if you need help with any specific section! 🛠️