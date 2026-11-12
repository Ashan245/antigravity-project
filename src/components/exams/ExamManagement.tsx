import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ExamRecord, Student } from '../../types';
import { Award, Plus, Trash2, Edit, Trophy, CheckCircle2, X } from 'lucide-react';

export const ExamManagement: React.FC = () => {
  const { exams, classes, students, addExam, updateExamMarks, deleteExam } = useData();

  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);

  // New exam form
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalMarks, setTotalMarks] = useState(100);

  // Edit marks modal
  const [markEditingStudent, setMarkEditingStudent] = useState<Student | null>(null);
  const [markInput, setMarkInput] = useState<number>(0);
  const [remarksInput, setRemarksInput] = useState('');

  const currentExam = exams.find(e => e.id === selectedExamId);
  const currentClass = classes.find(c => c.id === currentExam?.classId);

  // Enrolled students in current exam's class
  const classStudents = currentClass
    ? students.filter(s => s.enrolledClassIds?.includes(currentClass.id) && s.status === 'active')
    : [];

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('කරුණාකර විභාගයේ නම ඇතුළත් කරන්න.');
      return;
    }

    const newEx = addExam({
      title: title.trim(),
      classId,
      date,
      totalMarks,
      marksList: []
    });

    setTitle('');
    setIsAddExamOpen(false);
    setSelectedExamId(newEx.id);
  };

  const handleSaveStudentMark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExam || !markEditingStudent) return;

    updateExamMarks(currentExam.id, markEditingStudent.id, markInput, remarksInput.trim());
    setMarkEditingStudent(null);
  };

  const handleOpenStudentMarkEdit = (student: Student) => {
    const existing = currentExam?.marksList.find(m => m.studentId === student.id);
    setMarkInput(existing ? existing.marks : 0);
    setRemarksInput(existing?.remarks || '');
    setMarkEditingStudent(student);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              විභාග සහ ලකුණු (Exams & Marks)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            පන්ති ඇගයීම් පරීක්ෂණ, ලකුණු සටහන් කිරීම, සාමාර්ථ (A/B/C/S/F) සහ පන්ති ශ්‍රේණිගත කිරීම්
          </p>
        </div>

        <button
          onClick={() => setIsAddExamOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/25 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>නව පරීක්ෂණයක් එක් කරන්න</span>
        </button>
      </div>

      {/* Exam Selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {exams.map(ex => {
          const isSelected = ex.id === selectedExamId;
          return (
            <button
              key={ex.id}
              onClick={() => setSelectedExamId(ex.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{ex.title}</span>
              <span className={`ml-2 text-[10px] ${isSelected ? 'text-primary-100' : 'text-slate-400'}`}>
                ({ex.date})
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Exam Details & Marks Sheet */}
      {currentExam ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {currentExam.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                පන්තිය: <span className="font-bold text-slate-800 dark:text-slate-200">{currentClass?.name}</span> • දිනය: {currentExam.date} • මුළු ලකුණු: {currentExam.totalMarks}
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('මෙම විභාගය මකා දැමීමට ඔබට විශ්වාසද?')) {
                  deleteExam(currentExam.id);
                  setSelectedExamId(exams[0]?.id || '');
                }
              }}
              className="text-xs text-rose-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>විභාගය ඉවත් කරන්න</span>
            </button>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">ස්ථානය (Rank)</th>
                  <th className="py-3 px-4">සිසුවා (Student)</th>
                  <th className="py-3 px-4 text-center">ලබාගත් ලකුණු</th>
                  <th className="py-3 px-4 text-center">සාමාර්ථය (Grade)</th>
                  <th className="py-3 px-4">ගුරු සටහන (Remarks)</th>
                  <th className="py-3 px-4 text-right">ලකුණු ඇතුළත් කිරීම</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {classStudents.map(student => {
                  const markItem = currentExam.marksList.find(m => m.studentId === student.id);
                  const hasMark = markItem !== undefined;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-black">
                        {hasMark && markItem.rank ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-bold ${markItem.rank === 1 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400' : markItem.rank === 2 ? 'bg-slate-200 text-slate-800' : markItem.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>
                            #{markItem.rank}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={student.name}
                            className="w-8 h-8 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block">{student.sinhalaName || student.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{student.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {hasMark ? (
                          <span className="text-base font-black text-slate-900 dark:text-white">
                            {markItem.marks} <span className="text-[10px] text-slate-400 font-normal">/ {currentExam.totalMarks}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">ඇතුළත් කර නැත</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {hasMark ? (
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs ${markItem.grade === 'A' ? 'bg-emerald-100 text-emerald-800' : markItem.grade === 'B' ? 'bg-blue-100 text-blue-800' : markItem.grade === 'C' ? 'bg-amber-100 text-amber-800' : markItem.grade === 'S' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'}`}>
                            {markItem.grade}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">
                          {markItem?.remarks || '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenStudentMarkEdit(student)}
                          className="px-3 py-1.5 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-bold hover:bg-primary-100"
                        >
                          {hasMark ? 'සංස්කරණය' : 'ලකුණු එක් කරන්න'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400">විභාගයක් තෝරන්න හෝ නව විභාගයක් එක් කරන්න.</div>
      )}

      {/* Add Exam Modal */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">නව විභාගයක් එක් කිරීම</h3>
              <button onClick={() => setIsAddExamOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateExam} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">විභාගයේ නම *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. මාසික ඇගයීම් පරීක්ෂණය 02"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">පන්තිය (Class)</label>
                <select
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">පැවැත්වූ දිනය</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">මුළු ලකුණු</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={e => setTotalMarks(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddExamOpen(false)} className="px-4 py-2 border rounded-xl">අවලංගු කරන්න</button>
                <button type="submit" className="px-5 py-2 bg-primary-600 text-white rounded-xl font-bold">සුරකින්න</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Marks Modal */}
      {markEditingStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">ලකුණු ඇතුළත් කිරීම</h3>
                <p className="text-xs text-slate-500">{markEditingStudent.name} ({markEditingStudent.id})</p>
              </div>
              <button onClick={() => setMarkEditingStudent(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveStudentMark} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ලබාගත් ලකුණු (0 - {currentExam?.totalMarks}) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={currentExam?.totalMarks || 100}
                  required
                  value={markInput}
                  onChange={e => setMarkInput(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-base font-black text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ගුරු සටහන / ඇගයීම (Remarks)
                </label>
                <input
                  type="text"
                  placeholder="e.g. විශිෂ්ටයි! ජ්‍යාමිතිය කොටස තව පුහුණු වන්න."
                  value={remarksInput}
                  onChange={e => setRemarksInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setMarkEditingStudent(null)} className="px-4 py-2 border rounded-xl">අවලංගු කරන්න</button>
                <button type="submit" className="px-5 py-2 bg-primary-600 text-white rounded-xl font-bold">සුරකින්න</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
