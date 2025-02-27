
import { 
  User, 
  Teacher, 
  Student, 
  FitnessClass, 
  ClassEnrollment,
  Vacation,
  MOCK_USERS,
  MOCK_TEACHERS,
  MOCK_STUDENTS,
  MOCK_CLASSES,
  MOCK_VACATIONS
} from "@/lib/types";

// Inicializa o localStorage com dados mock se estiver vazio
const initializeDb = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(MOCK_USERS));
  }
  
  if (!localStorage.getItem('teachers')) {
    localStorage.setItem('teachers', JSON.stringify(MOCK_TEACHERS));
  }
  
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(MOCK_STUDENTS));
  }
  
  if (!localStorage.getItem('classes')) {
    localStorage.setItem('classes', JSON.stringify(MOCK_CLASSES));
  }
  
  if (!localStorage.getItem('vacations')) {
    localStorage.setItem('vacations', JSON.stringify(MOCK_VACATIONS));
  }
  
  if (!localStorage.getItem('enrollments')) {
    // Crie matrículas iniciais baseadas nos dados de alunos mockados
    const enrollments: ClassEnrollment[] = [];
    
    MOCK_STUDENTS.forEach(student => {
      if (student.enrolledClasses && student.enrolledClasses.length > 0) {
        student.enrolledClasses.forEach(classId => {
          enrollments.push({
            id: `e${Date.now()}-${student.id}-${classId}`,
            classId,
            studentId: student.id,
            enrolledAt: new Date(),
            attended: false
          });
        });
      }
    });
    
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
  }
};

// Funções de usuário
export const getUsers = (): User[] => {
  initializeDb();
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : [];
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

export const saveUser = (user: User): User => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    // Atualizar usuário existente
    users[existingIndex] = user;
  } else {
    // Adicionar novo usuário
    users.push(user);
  }
  
  localStorage.setItem('users', JSON.stringify(users));
  return user;
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length !== users.length) {
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    return true;
  }
  
  return false;
};

// Funções de professores
export const getTeachers = (): Teacher[] => {
  initializeDb();
  const data = localStorage.getItem('teachers');
  return data ? JSON.parse(data) : [];
};

export const getTeacherById = (id: string): Teacher | null => {
  const teachers = getTeachers();
  return teachers.find(teacher => teacher.id === id) || null;
};

export const saveTeacher = (teacher: Teacher): Teacher => {
  const teachers = getTeachers();
  const existingIndex = teachers.findIndex(t => t.id === teacher.id);
  
  if (existingIndex >= 0) {
    // Atualizar professor existente
    teachers[existingIndex] = teacher;
  } else {
    // Adicionar novo professor
    teachers.push(teacher);
  }
  
  localStorage.setItem('teachers', JSON.stringify(teachers));
  
  // Atualizar também na coleção de usuários
  saveUser(teacher);
  
  return teacher;
};

export const deleteTeacher = (id: string): boolean => {
  const teachers = getTeachers();
  const filteredTeachers = teachers.filter(teacher => teacher.id !== id);
  
  if (filteredTeachers.length !== teachers.length) {
    localStorage.setItem('teachers', JSON.stringify(filteredTeachers));
    deleteUser(id);
    return true;
  }
  
  return false;
};

// Funções de alunos
export const getStudents = (): Student[] => {
  initializeDb();
  const data = localStorage.getItem('students');
  return data ? JSON.parse(data) : [];
};

export const getStudentById = (id: string): Student | null => {
  const students = getStudents();
  return students.find(student => student.id === id) || null;
};

export const saveStudent = (student: Student): Student => {
  const students = getStudents();
  const existingIndex = students.findIndex(s => s.id === student.id);
  
  if (existingIndex >= 0) {
    // Atualizar aluno existente
    students[existingIndex] = student;
  } else {
    // Adicionar novo aluno
    students.push(student);
  }
  
  localStorage.setItem('students', JSON.stringify(students));
  
  // Atualizar também na coleção de usuários
  saveUser(student);
  
  return student;
};

export const deleteStudent = (id: string): boolean => {
  const students = getStudents();
  const filteredStudents = students.filter(student => student.id !== id);
  
  if (filteredStudents.length !== students.length) {
    localStorage.setItem('students', JSON.stringify(filteredStudents));
    deleteUser(id);
    return true;
  }
  
  return false;
};

// Funções de aulas
export const getClasses = (): FitnessClass[] => {
  initializeDb();
  const data = localStorage.getItem('classes');
  return data ? JSON.parse(data) : [];
};

export const getClassById = (id: string): FitnessClass | null => {
  const classes = getClasses();
  return classes.find(cls => cls.id === id) || null;
};

export const saveClass = (fitnessClass: FitnessClass): FitnessClass => {
  const classes = getClasses();
  const existingIndex = classes.findIndex(c => c.id === fitnessClass.id);
  
  if (existingIndex >= 0) {
    // Atualizar aula existente
    classes[existingIndex] = fitnessClass;
  } else {
    // Adicionar nova aula
    classes.push(fitnessClass);
  }
  
  localStorage.setItem('classes', JSON.stringify(classes));
  return fitnessClass;
};

export const deleteClass = (id: string): boolean => {
  const classes = getClasses();
  const filteredClasses = classes.filter(cls => cls.id !== id);
  
  if (filteredClasses.length !== classes.length) {
    localStorage.setItem('classes', JSON.stringify(filteredClasses));
    
    // Remover também todas as matrículas relacionadas a esta aula
    const enrollments = getEnrollments();
    const updatedEnrollments = enrollments.filter(enrollment => enrollment.classId !== id);
    localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
    
    return true;
  }
  
  return false;
};

// Funções de matrículas
export const getEnrollments = (): ClassEnrollment[] => {
  initializeDb();
  const data = localStorage.getItem('enrollments');
  return data ? JSON.parse(data) : [];
};

export const getEnrollmentsByClassId = (classId: string): ClassEnrollment[] => {
  const enrollments = getEnrollments();
  return enrollments.filter(enrollment => enrollment.classId === classId);
};

export const getEnrollmentsByStudentId = (studentId: string): ClassEnrollment[] => {
  const enrollments = getEnrollments();
  return enrollments.filter(enrollment => enrollment.studentId === studentId);
};

export const saveEnrollment = (enrollment: ClassEnrollment): ClassEnrollment => {
  const enrollments = getEnrollments();
  const existingIndex = enrollments.findIndex(e => e.id === enrollment.id);
  
  if (existingIndex >= 0) {
    // Atualizar matrícula existente
    enrollments[existingIndex] = enrollment;
  } else {
    // Adicionar nova matrícula
    enrollments.push(enrollment);
    
    // Atualizar o contador de matriculados na aula
    const fitnessClass = getClassById(enrollment.classId);
    if (fitnessClass) {
      fitnessClass.enrolledCount += 1;
      saveClass(fitnessClass);
    }
    
    // Atualizar as aulas matriculadas do aluno
    const student = getStudentById(enrollment.studentId);
    if (student) {
      if (!student.enrolledClasses) {
        student.enrolledClasses = [];
      }
      if (!student.enrolledClasses.includes(enrollment.classId)) {
        student.enrolledClasses.push(enrollment.classId);
        saveStudent(student);
      }
    }
  }
  
  localStorage.setItem('enrollments', JSON.stringify(enrollments));
  return enrollment;
};

export const deleteEnrollment = (id: string): boolean => {
  const enrollments = getEnrollments();
  const enrollmentToDelete = enrollments.find(e => e.id === id);
  
  if (!enrollmentToDelete) return false;
  
  const filteredEnrollments = enrollments.filter(enrollment => enrollment.id !== id);
  
  if (filteredEnrollments.length !== enrollments.length) {
    localStorage.setItem('enrollments', JSON.stringify(filteredEnrollments));
    
    // Atualizar o contador de matriculados na aula
    const fitnessClass = getClassById(enrollmentToDelete.classId);
    if (fitnessClass && fitnessClass.enrolledCount > 0) {
      fitnessClass.enrolledCount -= 1;
      saveClass(fitnessClass);
    }
    
    // Atualizar as aulas matriculadas do aluno
    const student = getStudentById(enrollmentToDelete.studentId);
    if (student && student.enrolledClasses) {
      student.enrolledClasses = student.enrolledClasses.filter(classId => classId !== enrollmentToDelete.classId);
      saveStudent(student);
    }
    
    return true;
  }
  
  return false;
};

// Funções de férias
export const getVacations = (): Vacation[] => {
  initializeDb();
  const data = localStorage.getItem('vacations');
  return data ? JSON.parse(data) : [];
};

export const getVacationsByTeacherId = (teacherId: string): Vacation[] => {
  const vacations = getVacations();
  return vacations.filter(vacation => vacation.teacherId === teacherId);
};

export const saveVacation = (vacation: Vacation): Vacation => {
  const vacations = getVacations();
  const existingIndex = vacations.findIndex(v => v.id === vacation.id);
  
  if (existingIndex >= 0) {
    // Atualizar férias existentes
    vacations[existingIndex] = vacation;
  } else {
    // Adicionar novas férias
    vacations.push(vacation);
  }
  
  localStorage.setItem('vacations', JSON.stringify(vacations));
  
  // Atualizar o status de férias do professor
  if (vacation.approved) {
    const teacher = getTeacherById(vacation.teacherId);
    if (teacher) {
      teacher.onVacation = true;
      teacher.vacationDates = {
        start: new Date(vacation.startDate),
        end: new Date(vacation.endDate)
      };
      saveTeacher(teacher);
    }
  }
  
  return vacation;
};

export const deleteVacation = (id: string): boolean => {
  const vacations = getVacations();
  const vacationToDelete = vacations.find(v => v.id === id);
  
  if (!vacationToDelete) return false;
  
  const filteredVacations = vacations.filter(vacation => vacation.id !== id);
  
  if (filteredVacations.length !== vacations.length) {
    localStorage.setItem('vacations', JSON.stringify(filteredVacations));
    
    // Verifica se precisamos atualizar o status de férias do professor
    if (vacationToDelete.approved) {
      const teacherVacations = filteredVacations.filter(
        v => v.teacherId === vacationToDelete.teacherId && v.approved
      );
      
      // Se não houver mais férias aprovadas, atualiza o status do professor
      if (teacherVacations.length === 0) {
        const teacher = getTeacherById(vacationToDelete.teacherId);
        if (teacher) {
          teacher.onVacation = false;
          teacher.vacationDates = undefined;
          saveTeacher(teacher);
        }
      }
    }
    
    return true;
  }
  
  return false;
};

// Função de autenticação
export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const authenticate = (email: string, password: string): AuthResponse => {
  const users = getUsers();
  const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return {
      success: false,
      message: "Usuário não encontrado."
    };
  }
  
  // Para fins de demonstração, usamos uma senha simples
  if (password === "password") {
    return {
      success: true,
      user
    };
  }
  
  return {
    success: false,
    message: "Senha incorreta."
  };
};

// Função para o check-in do aluno
export const studentCheckIn = (studentId: string): boolean => {
  const student = getStudentById(studentId);
  
  if (student) {
    student.lastCheckIn = new Date();
    saveStudent(student);
    return true;
  }
  
  return false;
};

// Inicializa o banco de dados na primeira execução
initializeDb();
