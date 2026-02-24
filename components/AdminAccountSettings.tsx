import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AdminAccountSettings: React.FC = () => {
    // Verification State
    const [isVerified, setIsVerified] = useState(false);
    const [verifyPassword, setVerifyPassword] = useState('');

    // Mock initial data
    const [formData, setFormData] = useState({
        id: 'admin',
        name: '관리자',
        password: '',
        passwordConfirm: '',
        contact: '010-1234-5678',
        email: 'utop@utopsoft.co.kr'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVerify = () => {
        if (!verifyPassword) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        // Mock verification: accept any non-empty password for now, or match a dummy one
        // User requested: "If result is true -> move to settings"
        setIsVerified(true);
    };

    const handleSave = () => {
        if (formData.password && formData.password !== formData.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        // API call logic here
        alert('저장되었습니다.');
    };

    if (!isVerified) {
        return (
            <div className="space-y-6">
                {/* Header */}
                {/* Header removed */}

                <div className="bg-white border-t-2 border-gray-800 border-b border-gray-200">
                    <div className="p-6 text-center text-sm text-gray-500 border-b border-gray-200">
                        개인 정보를 안전하게 보호하기 위해 비밀번호를 다시 한 번 입력해주세요.
                    </div>

                    {/* ID */}
                    <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                        <div className="bg-[#F1F3F6] p-4 text-sm font-bold flex items-center justify-center border-r border-gray-200">
                            아이디
                        </div>
                        <div className="p-3 text-sm flex items-center text-gray-700">
                            admin
                        </div>
                    </div>

                    {/* Password */}
                    <div className="grid grid-cols-[160px_1fr]">
                        <div className="bg-[#F1F3F6] p-4 text-sm font-bold flex items-center justify-center border-r border-gray-200">
                            비밀번호
                        </div>
                        <div className="p-3 flex items-center">
                            <div className="relative w-full max-w-md">
                                <input
                                    type={showVerifyPassword ? "text" : "password"}
                                    value={verifyPassword}
                                    onChange={(e) => setVerifyPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                                    className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="비밀번호를 입력하세요"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showVerifyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleVerify}
                        className="px-8 py-2 bg-[#6DC9C1] text-white rounded font-bold hover:bg-[#5bb7af]"
                    >
                        확인
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            {/* Header removed */}

            <div className="bg-white border-t-2 border-gray-800 border-b border-gray-200">

                {/* ID */}
                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                    <div className="bg-[#F1F3F6] p-4 text-sm font-bold flex items-center justify-center border-r border-gray-200">
                        아이디
                    </div>
                    <div className="p-3 text-sm flex items-center text-gray-700">
                        {formData.id}
                    </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                    <div className="bg-[#F1F3F6] p-4 text-sm font-bold flex items-center justify-center border-r border-gray-200">
                        이름
                    </div>
                    <div className="p-3 text-sm flex items-center text-gray-700">
                        {formData.name}
                    </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                    <div className="bg-[#F1F3F6] p-4 text-sm font-bold flex items-center justify-center border-r border-gray-200">
                        비밀번호
                    </div>
                    <div className="p-3 flex items-center">
                        <div className="relative w-full max-w-md">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Password Confirm */}
                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                    <div className="bg-[#F1F3F6] p-4 text-sm font-bold flex items-center justify-center border-r border-gray-200">
                        비밀번호 확인
                    </div>
                    <div className="p-3 flex items-center">
                        <div className="relative w-full max-w-md">
                            <input
                                type={showPasswordConfirm ? "text" : "password"}
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                className="w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-[160px_1fr] border-b border-gray-200">
                    <div className="bg-[#F1F3F6] p-4 text-sm font-bold flex items-center justify-center border-r border-gray-200">
                        연락처
                    </div>
                    <div className="p-3 flex items-center">
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="w-full max-w-md h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-[160px_1fr]">
                    <div className="bg-[#F1F3F6] p-4 text-sm font-bold flex items-center justify-center border-r border-gray-200">
                        이메일
                    </div>
                    <div className="p-3 flex items-center">
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full max-w-md h-10 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="px-8 py-2 bg-[#6DC9C1] text-white rounded font-bold hover:bg-[#5bb7af]"
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default AdminAccountSettings;
