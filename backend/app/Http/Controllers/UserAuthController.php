<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserAuthController extends Controller
{
    public function register(Request $request)
    {
        $register = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|min:8'
        ]);

        $token = Str::random(60); 

        $user = User::create([
            'name' => $register['name'],
            'email' => $register['email'],
            'password' => Hash::make($register['password']),
            'api_token' => $token, 
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User Successfully registered',
            'api_token' => $token,
        ]);
    }

    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'message' => 'Invalid Credentials'
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'User login successfully',
            'user_id' => $user->id,
            'name' => $user->name,
            'api_token' => $user->api_token, 
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function getUsers()
    {
        $users = User::all();

        return response()->json([
            'status' => 'success',
            'users' => $users,
        ]);
    }
}
