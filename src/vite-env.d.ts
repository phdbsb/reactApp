Da li mozes da mi pomognes oko react aplikacije. Ja cu da ti posaljem strukturu foldera i fajlova, 
i izgled  samih fajlova. Nakon toga poslacu ti i sta trebas da radis. Nemoj da mi pises kod dok ti ne posaljem sve.

U src folderu imam fajlove App.tsx, main.tsx i foldere components i models i store.
U folderu components imam foldere Exams, Form i Navbar.
U folderu models imam fajl: ExamCard.ts
U folderu store imam: folder features i fajl index.ts. U folderu features imam fajlove: ExamCardInterface.ts i examsSlice.ts
U folderu Exams imam: Exam.tsx, Exams.tsx, index.tsx, style.css
U folderu Form imam: Form.tsx, FormManager.tsx, index.tsx i style.css
U folderu Navbar imam: AccountMenu.tsx, index.tsx, Navbar.tsx i style.css

Folder Exams ima:
Exam.tsx:
import { ExamCard } from '../../models/ExamCard';
import './style.css'

interface ExamCardProps {
    exam: ExamCard;
    timeLeft: string;
    onDoubleClick: (exam: ExamCard) => void;
};

const Exam = ({ exam, onDoubleClick, timeLeft  }: ExamCardProps) => {

    return (
        <div className="exam-card" onDoubleClick={() => onDoubleClick(exam)} title="Double-click to edit">
            <div className="exam-header">
                <h3 className="exam-title">{exam.title}</h3>
                <button className="apply-button">Report exam</button>
            </div>
            <div className="exam-footer">
                <span className="exam-faculty">{exam.faculty}</span>
                <span className="exam-time"> {timeLeft} </span>
            </div>
        </div>
    );
};

export default Exam;

Exams.tsx:
import { useState } from "react";
import Exam from "./Exam";
import { Form } from "../Form";
import { ExamCard } from "../../models/ExamCard";
import { parseISO, formatDistanceToNow } from 'date-fns';
import "./style.css";

const examData: ExamCard[] = [
    new ExamCard(1, "Operating systems", "Faculty of Electronics", '2024-12-10T09:00:00'),
    new ExamCard(2, "Computer Network", "Faculty of Electronics", '2024-12-11T14:00:00'),
    new ExamCard(3, "Web programming", "Faculty of Electronics", '2024-12-15T08:00:00'),
    new ExamCard(4, "Software engineering", "Faculty of Electronics", '2024-12-18T12:00:00'),
    new ExamCard(5, "Database systems", "Faculty of Electronics", '2024-12-20T10:00:00')
];

const Exams = () => {
    const [exams, setExams] = useState<ExamCard[]>(examData);

    const [formState, setFormState] = useState ({
        isEditMode: false,
        examToEditId: null as number | null,
        showForm: false
    });

    const onExamDoubleClick = (exam: ExamCard) => {
        setFormState({
            isEditMode: true,
            examToEditId: exam.id,
            showForm: true
        });
    };

    const onCreateClick = () => {
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: true,
        });
    };

    const handleSave = (exam: ExamCard) => {
        setExams((prevExams) =>
            formState.isEditMode && formState.examToEditId !== null ? 
                prevExams.map((e) => (e.id === formState.examToEditId ? { ...exam } : e)) : [...prevExams, exam]
        );
        setFormState({
            isEditMode: false,
            examToEditId: null,
            showForm: false,
        });
    };

    const examToEdit = formState.examToEditId ? exams.find((exam) => exam.id === formState.examToEditId) : undefined;

    const calculateTimeLeft = (exam: ExamCard) => {
        const examDate = parseISO(exam.startsIn);
        return formatDistanceToNow(examDate, { addSuffix: true });
    };
    
    return (
        <>
            <div className="exams-container">
                {exams.map((exam) => (
                    <Exam key={exam.id} exam={exam} onDoubleClick={onExamDoubleClick} timeLeft={calculateTimeLeft(exam)}/>
                ))}
            </div>
            <div className="create-button-container">
                <button className="create-button" onClick={onCreateClick}> Create Exam </button>
            </div>
            {formState.showForm && (
                <div className="form-container">
                    <Form
                        isEditMode={formState.isEditMode}
                        examToEdit={examToEdit}
                        onSave={handleSave}
                    />
                </div>
            )}
        </>
    );
};

export default Exams;

index.tsx:
export { default as Exam } from './Exams';

style.css:
.exams-container {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    gap: 20px;
    justify-content: center;
}

.exam-card {
    width: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
}

.exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.exam-footer {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-top: 10px;
}

.exam-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}

.apply-button {
    background-color: #4c85e0;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.apply-button:hover {
    background-color: #0056b3;
}

.exam-time {
    color: #ff6347;
}

.create-button-container {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
}

.create-button {
    padding: 10px 20px;
    background-color: #4c85e0;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    align-self: flex-end;
    transition: background-color 0.3s;
}
.create-button:hover {
    background-color: #0056b3;
}


Folder Form:
Form.tsx:
import FormManager from "./FormManager";
import { ExamCard } from "../../models/ExamCard";
import './style.css';

interface FormProps {
    isEditMode: boolean;
    examToEdit?: ExamCard;
    onSave: (exam: ExamCard) => void;
}

const Form = ({ isEditMode, examToEdit, onSave }: FormProps) => {
    return (
        <div className="form-wrapper">
            <h2>{isEditMode ? "Edit Exam" : "Create Exam"}</h2>
            <FormManager
                isEditMode={isEditMode}
                examToEdit={examToEdit}
                onSave={onSave}
            />
        </div>
    );
};

export default Form;

FormManager.tsx:
import { useEffect, useState } from "react";
import { ExamCard } from "../../models/ExamCard";
import { useForm, Controller  } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./style.css";


interface FormData {
    title: string;
    faculty: string;
    time: Dayjs | null;
}

interface FormManagerProps {
    isEditMode: boolean;
    examToEdit?: ExamCard; 
    onSave: (exam: ExamCard) => void;
}

const FormManager = ({isEditMode, examToEdit, onSave}: FormManagerProps) => {
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>();

    const onSubmit = (data: FormData) => {

        const newExam = new ExamCard (
            examToEdit ? examToEdit.id : Date.now(),
            data.title,
            data.faculty,
            dayjs(data.time).toISOString()
        );
        onSave(newExam);
        reset();
    };

    useEffect(() => {
        if (isEditMode && examToEdit) {
          reset({
            title: examToEdit.title,
            faculty: examToEdit.faculty,
            time: dayjs(examToEdit.startsIn),
          });
        } else {
            reset({ title: "", faculty: "", time: dayjs() });
        }
    }, [isEditMode, examToEdit, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Title:</label>
                <input
                    {...register("title", { required: "This field is required" })}
                />
                {errors.title && <span>{errors.title.message}</span>}
            </div>
            <div>
                <label>Faculty:</label>
                <input
                    {...register("faculty", { required: "This field is required" })}
                />
                {errors.faculty && <span>{errors.faculty.message}</span>}
            </div>
            <div>
                <label>Date and Time:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name="time"
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field }) => (
                            <DateTimePicker
                                {...field}
                                value={field.value || null}
                                onChange={(newValue) => field.onChange(newValue)}
                            />
                        )}
                    />
                </LocalizationProvider>
                {errors.time && <span>{errors.time.message}</span>}
            </div>
            <button type="submit">{isEditMode ? "Save Changes" : "Create Exam"}</button>
        </form>
    );
}

export default FormManager;

index.tsx:
export {default as Form} from './Form';
export {default as FormManager} from './FormManager';

style.css:
.form-wrapper {
  width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.form-wrapper h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

form div {
  display: flex;
  flex-direction: column;
}

form label {
  font-size: 0.9em;
  margin-bottom: 5px;
  color: #555;
}

form input {
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
}

form input:focus {
  border-color: #007bff;
}

form button {
  padding: 10px 15px;
  font-size: 1em;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

form button:hover {
  background-color: #0056b3;
}

form span {
  font-size: 0.85em;
  color: red;
  margin-top: 5px;
}

Folder Navbar ima fajlove:
AccountMenu.tsx:

const AccountMenu = () => {

    return (
        <div className="account-menu">
            <div className="menu-section">
                <div className="menu-item">
                    <img src="images/user.png" alt="Profile Icon" className="account-icon"/>
                    <span>Profile</span>
                </div>
                <div className="menu-item">
                    <img src="images/user.png" alt="My Account Icon" className="account-icon" />
                    <span>My Account</span>
                </div>
            </div>
            <hr />
            <div className="menu-section">
                <div className="menu-item">
                    <img src="images/add-user.png" alt="Add Another Account Icon" className="account-icon" />
                    <span>Add another account</span>
                </div>
                <div className="menu-item">
                    <img src="images/setting.png" alt="Settings Icon" className="account-icon" />
                    <span>Settings</span>
                </div>
                <div className="menu-item">
                    <img src="images/logout.png" alt="Logout Icon" className="account-icon" />
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    );
};

export default AccountMenu;

Navbar.tsx:
import React, { useState } from "react";
import AccountMenu from "./AccountMenu";
import "./style.css";


const Navbar = () => {
    const[menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const handleLogout = () => {
        console.log('User logged out');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar-container">
            <h1 className="navbar-title">My Exams</h1>
            <div className="account-container">
                <span className="contact">Contact</span>
                <span className="account-name">Petar</span>
                <img src="/images/user.png" onClick={toggleMenu} alt="Account icon" className="main_account_icon"/>
                {menuOpen && <AccountMenu />}
            </div>
        </nav>
    );
};

export default Navbar;

index.tsx:
export { default as Navbar} from './Navbar';

style.css:
.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;
}
.navbar-title {
    font-size: 1.5em;
}
.account-container {
    display: flex;
    align-items: center;
    position: relative;
}
.contact {
    margin-right: 20px;
}
.account-name {
    margin-right: 20px;
}
.account-icon {
    width: 20px;
    height: 20px;
}
.main_account_icon {
    width: 25px;
    height: 25px;
}
.account-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 200px;
    padding: 10px;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.menu-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 10px 0;
}

Folder models:
ExamCard.ts:
export class ExamCard {
    id: number;
    title: string;
    faculty: string;
    startsIn: string;

    constructor(id: number, title: string, faculty: string, startsIn: string) {
        this.id = id;
        this.title = title;
        this.faculty = faculty;
        this.startsIn = startsIn;
    }
};

App.tsx:
import { Navbar } from './components/Navbar';
import Exams from './components/Exams/Exams';

const App = () => {
  return (
    <div>
      <Navbar />
      <Exams />
    </div>
  );
};

export default App;

main.tsx:
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



src/
│
├── assets/              # Slike, fontovi, i drugi statički resursi
│
├── components/          # Reusable komponente
│   ├── Button.tsx
│   ├── Navbar.tsx
│   └── ...
│
├── features/            # Redukovani kod, slice-ovi i logika po funkcionalnostima
│   ├── auth/            # Komponenta i slice vezani za autentifikaciju
│   │   ├── authSlice.ts
│   │   ├── Auth.tsx
│   │   └── authAPI.ts   # API pozivi vezani za autentifikaciju
│   ├── exams/           # Komponenta i slice vezani za ispite
│   │   ├── examsSlice.ts
│   │   ├── Exams.tsx
│   │   └── examsAPI.ts
│   └── ...
│
├── app/                 # Redux store, konfiguracija i zajednički middleware
│   ├── store.ts         # Store konfiguracija (configureStore)
│   └── rootReducer.ts   # Kombinovani reducer
│
├── hooks/               # Custom React Hooks
│   └── useAuth.ts       # Hook vezan za autentifikaciju
│
├── pages/               # Page komponente (stranice koje kombinuju komponente)
│   ├── Home.tsx
│   ├── ExamsPage.tsx
│   └── ...
│
├── utils/               # Pomocni fajlovi i funkcije
│   ├── apiUtils.ts
│   └── helpers.ts
│
└── App.tsx              # Glavna aplikacija, entry point
import { configureStore } from '@reduxjs/toolkit';
import examsReducer from '../features/exams/examsSlice';

export const store = configureStore({
  reducer: {
    exams: examsReducer,
  },
});




Ja kada ovo stavim da koristi obicne objekte pise cannot find name id, title, faculty, startsIn:
const initialState: ExamsState = {
  exams: [
    { id: 1, title: "Operating systems", faculty: "Faculty of Electronics", startsIn: '2024-12-10T09:00:00' },
    { id: 2, title: "Computer Network", faculty: "Faculty of Electronics", startsIn: '2024-12-11T14:00:00' },
    { id: 3, title: "Web programming", faculty: "Faculty of Electronics", startsIn: '2024-12-15T08:00:00' },
    { id: 4, title: "Software engineering", faculty: "Faculty of Electronics", startsIn: '2024-12-18T12:00:00' },
    { id: 5, title: "Database systems", faculty: "Faculty of Electronics", startsIn: '2024-12-20T10:00:00' },
  ],
};

Ne znam sta za sta si koristio sada json server. Ali sada cu da ti kazem sta sam ja hteo za sta da koristis