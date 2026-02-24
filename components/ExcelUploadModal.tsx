import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface ExcelUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
    title?: string;
    description?: string;
}

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
    isOpen,
    onClose,
    onUpload,
    title = "엑셀 파일 업로드",
    description = "데이터를 일괄 등록하기 위해 엑셀 파일을 업로드해주세요."
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file: File) => {
        // Check file type (xlsx, xls, csv)
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv' // .csv
        ];

        // Some browsers might not have the correct mime type, so check extension as well
        const fileName = file.name.toLowerCase();
        const isValidExt = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');

        if (!validTypes.includes(file.type) && !isValidExt) {
            setError('엑셀(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.');
            return false;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('파일 크기는 10MB를 초과할 수 없습니다.');
            return false;
        }

        setError('');
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            onClose();
            setSelectedFile(null); // Reset after upload
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-gray-50
              ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-gray-400'}
              ${selectedFile ? 'border-green-500 bg-green-50/30' : ''}
              ${error ? 'border-red-300 bg-red-50/30' : ''}
            `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleChange}
                        />

                        {selectedFile ? (
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm truncate max-w-[200px] mx-auto">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFile(null);
                                    }}
                                    className="text-xs text-red-500 hover:underline font-medium"
                                >
                                    파일 제거
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 pointer-events-none">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${error ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                                    {error ? <AlertCircle size={24} /> : <Upload size={24} />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700 text-sm">
                                        {error ? '파일 오류' : '파일을 드래그하거나 클릭하여 업로드'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        xlsx, xls, csv (최대 10MB)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-3 flex items-start space-x-2 text-red-500 text-xs px-2">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm transition-all shadow-sm"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedFile}
                        className={`px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md flex items-center
              ${selectedFile
                                ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-200'
                                : 'bg-gray-300 cursor-not-allowed shadow-none'}
            `}
                    >
                        <Upload size={16} className="mr-2" />
                        업로드
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploadModal;
