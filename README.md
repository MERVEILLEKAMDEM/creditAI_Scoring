# 💳 CreditAI Scoring – analyse du risque de crédit par IA

**Application full-stack qui évalue le risque de défaut d'un demandeur de crédit** : un modèle de machine learning construit sur un jeu de ~100 000 dossiers, une API de scoring et un tableau de bord sécurisé pour les analystes crédit.

## Ce que fait l'application

- **Score de risque instantané** : l'analyste saisit un dossier (revenus, montant, taux, retards de paiement, impayés, secteur, type de crédit, garanties) et obtient une probabilité de défaut.
- **Tableau de bord** : suivi des demandes, analytics et export.
- **Comptes et rôles** : authentification JWT, mots de passe hachés (bcrypt), routes protégées.

## Architecture

```
Next.js 15 + TypeScript (app/, components/)   ──►  API de scoring FastAPI (scripts/api_backend.py)
        │                                                   │
   PostgreSQL (utilisateurs, demandes)          Pipeline scikit-learn (ColumnTransformer + modèle)
                                                 + variante réseau de neurones PyTorch (best_credit_model.pth)
```

| Couche | Technologies |
|---|---|
| Front-end | Next.js 15, React 19, TypeScript, Tailwind, shadcn/ui, Recharts |
| API ML | Python, FastAPI, pandas, scikit-learn, PyTorch |
| Données | PostgreSQL, jeu de 99 516 dossiers et 15 variables (`scripts/credit_dataset_99517_rows_noisy.csv`) |
| Démo rapide | Interface Streamlit (`scripts/app.py`) |

## Lancer le modèle seul

```bash
pip install -r requirements.txt
cd scripts && uvicorn api_backend:app --reload     # API sur http://localhost:8000/docs
streamlit run app.py                              # ou l'interface de démo
```

> ⚠️ Les identifiants créés par `scripts/init-db.js` sont des **identifiants de démonstration en local**. Changez-les avant tout déploiement.

---

## Installation complète (application web)

### Variables d'environnement

Add these environment variables to your `.env.local` file:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=credit_risk_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# JWT Secret (already configured in Vercel)
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_key

# Email Configuration (Optional - for welcome emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database named `credit_risk_db`
3. Update the environment variables with your database credentials
4. Run the initialization endpoint: `npm run init-db`

### Option 2: Cloud PostgreSQL (Recommended)

1. Use services like:
   - **Supabase** (Free tier available)
   - **Railway** (PostgreSQL hosting)
   - **ElephantSQL** (PostgreSQL as a service)
   - **AWS RDS** (Production ready)

2. Get your connection details and update environment variables
3. Run the initialization endpoint: `npm run init-db`

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` with the database configuration above

3. **Initialize the database:**
   ```bash
   npm run init-db
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication

The system includes secure authentication functionality:

- **Email/Password login** - Standard authentication flow
- **JWT tokens** - Secure session management
- **Password hashing** - Bcrypt with salt rounds
- **Protected routes** - Dashboard requires authentication

### Authentication Flow:
1. User enters email and password
2. System validates credentials against database
3. JWT token is generated and stored
4. User is redirected to dashboard
5. Token is used for subsequent requests

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `created_at` / `updated_at` - Timestamps

### Applications Table
- `id` - Primary key
- `application_id` - Unique application identifier
- Personal information fields
- Financial information fields
- `credit_score` - AI-generated credit score
- `risk_level` - Low/Medium/High risk assessment
- `status` - Application status
- `created_at` / `updated_at` - Timestamps

## API Endpoints

### Authentication
- `PUT /api/auth` - Login with email/password
- `POST /api/auth` - Register new user

### Applications
- `GET /api/applications` - List all applications
- `POST /api/applications` - Create new application
- `GET /api/applications/[id]` - Get application details
- `PATCH /api/applications/[id]` - Update application status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Database
- `POST /api/init-db` - Initialize database tables
- `GET /api/init-db` - Test database connection

### Development
- `POST /api/test-login` - Test login without password (dev only)

## Security Features

- **Password Hashing** - Bcrypt with salt rounds
- **JWT Tokens** - Secure session management
- **SQL Injection Prevention** - Parameterized queries
- **CORS Protection** - Configured for security
- **Environment Variables** - Sensitive data protection
- **Protected Routes** - Authentication required for dashboard

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables in Vercel dashboard**
4. **Deploy automatically**

### Environment Variables for Production:
- Set `NODE_ENV=production`
- Use production database credentials
- Ensure JWT_SECRET is secure and unique

## Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── signup/
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # UI components
├── contexts/             # React contexts
│   └── auth-context.tsx  # Authentication context
├── lib/                  # Utility libraries
│   ├── db.ts            # Database connection
│   └── email.ts         # Email utilities
└── hooks/               # Custom React hooks
```

### Adding New Features

1. **Database Changes** - Update schema in `lib/db.ts`
2. **API Routes** - Add new endpoints in `app/api/`
3. **UI Components** - Create reusable components
4. **Pages** - Add new pages in `app/` directory

## Support

For issues and questions:
1. Check the console for error messages
2. Verify database connection with `GET /api/init-db`
3. Ensure all environment variables are set correctly
4. Check the application logs for detailed error information

## License

This project is licensed under the MIT License.
