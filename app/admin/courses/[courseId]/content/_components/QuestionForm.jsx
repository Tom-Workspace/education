"use client";

import React from 'react';

export default function QuestionForm({ 
  question, 
  setQuestion, 
  handleOptionChange, 
  onSave, 
  onCancel, 
  isEditing = false 
}) {
  return (
    <div className="bg-white dark:bg-midNight-700 p-4 rounded-md mb-4 border border-gray-200 dark:border-gray-600">
      <h5 className="font-semibold mb-3">
        {isEditing ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
      </h5>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="questionText">
          نص السؤال
        </label>
        <textarea
          id="questionText"
          className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
          value={question.question}
          onChange={(e) => setQuestion({...question, question: e.target.value})}
          rows="2"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          الخيارات
        </label>
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="radio"
              id={`option-${index}`}
              name="correctOption"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              checked={question.correctOption === index}
              onChange={() => setQuestion({...question, correctOption: index})}
            />
            <label htmlFor={`option-${index}`} className="mr-2 text-gray-700 dark:text-gray-300 w-20">
              {index === 0 ? 'الإجابة الصحيحة:' : `الخيار ${index + 1}:`}
            </label>
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="questionPoints">
          النقاط
        </label>
        <input
          id="questionPoints"
          type="number"
          min="1"
          className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
          value={question.points}
          onChange={(e) => setQuestion({...question, points: parseInt(e.target.value)})}
          required
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
          onClick={onSave}
        >
          {isEditing ? 'تحديث السؤال' : 'إضافة السؤال'}
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={onCancel}
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}
