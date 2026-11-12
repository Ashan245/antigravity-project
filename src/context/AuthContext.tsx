import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, Teacher, Student } from '../types';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

interface AuthContextType {
  role: UserRole;
  currentTeacher: Teacher | null;
  currentStudent: Student | null;
  firebaseUser: FirebaseUser | null;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  setCurrentTeacher: (teacher: Teacher | null) => void;
  setCurrentStudent: (student: Student | null) => void;
  loginWithFirebase: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchUserSimulated: (role: UserRole, id?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('tuition_pro_role') as UserRole) || 'admin';
  });
  const [currentTeacher, setCurrentTeacherState] = useState<Teacher | null>(null);
  const [currentStudent, setCurrentStudentState] = useState<Student | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    localStorage.setItem('tuition_pro_role', role);
  }, [role]);

  // Monitor Firebase Auth state if configured
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Derive role from email or claims
        if (user.email?.includes('teacher')) {
          setRoleState('teacher');
        } else if (user.email?.includes('student')) {
          setRoleState('student');
        } else if (user.email?.includes('parent')) {
          setRoleState('parent');
        } else {
          setRoleState('admin');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const setCurrentTeacher = (t: Teacher | null) => {
    setCurrentTeacherState(t);
  };

  const setCurrentStudent = (s: Student | null) => {
    setCurrentStudentState(s);
  };

  const loginWithFirebase = async (email: string, pass: string) => {
    if (!isFirebaseConfigured() || !auth) {
      // Simulate login for offline / quick demo mode
      if (email.includes('teacher')) setRoleState('teacher');
      else if (email.includes('student')) setRoleState('student');
      else if (email.includes('parent')) setRoleState('parent');
      else setRoleState('admin');
      return { success: true };
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      setFirebaseUser(res.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const logout = async () => {
    if (auth && isFirebaseConfigured()) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn('Sign out warning:', e);
      }
    }
    setFirebaseUser(null);
    setRoleState('admin');
  };

  const switchUserSimulated = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        currentTeacher,
        currentStudent,
        firebaseUser,
        isLoggedIn: true,
        setRole,
        setCurrentTeacher,
        setCurrentStudent,
        loginWithFirebase,
        logout,
        switchUserSimulated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
