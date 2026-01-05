import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Badminton Booking</h1>
          <p className="text-gray-500 mt-2">Đăng nhập để tiếp tục</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
