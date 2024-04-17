<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    public function index()
    {
        $blogPosts = Blog::all();
        return response()->json([
            'status' => 'success',
            'blog_posts' => $blogPosts,
        ]);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'content' => 'required|string',
            'author_id' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'publication_date' => 'required|date',
            'tags' => 'required|array',
            'tags.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->all(),
            ], 400);
        }

        $filename = "";
            $destinationPath = public_path('images/');
            $status = true;
            
            $multi_blog_images = [];
            if ($files = $request->file('images')){
                foreach($files as $file_b){
                    $name = "Blog-".strtotime(date('d-m-Y h:i:s')).$file_b->getClientOriginalName();
                    $multi_blog_images[] = $name;
                    $file_b->move($destinationPath, $name);
                    }
                $data['images'] = implode("|",$multi_blog_images);            
            }

        $blogPost = Blog::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'author_id' => $request->input('author_id'),
            'images' => $multi_blog_images, 
            'publication_date' => $request->input('publication_date'),
            'tags' => $request->input('tags'),
        ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Blog post created successfully',
                'blog_post' => $blogPost,
            ]);
    }

    public function show($id)
    {
        $blogPost = Blog::find($id);

        if (!$blogPost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Blog post not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'blog_post' => $blogPost,
        ]);
    }

    public function update(Request $request, $id)
    {
        $blogPost = Blog::find($id);

        if (!$blogPost) {
            return response()->json([
                'error' => 'Blog post not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'content' => 'required|string',
            'author_id' => 'required|string',
            'publication_date' => 'required|date',
            'tags' => 'required|array',
            'tags.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->all(),
            ], 400);
        }

        $multi_blog_images = [];
            
        if ($files = $request->file()) {
            foreach($files as $key => $file) {
                if ($request->hasFile($key)) {
                    $name = "Multiple-" . strtotime(date('d-m-Y h:i:s')) . $file->getClientOriginalName();
                    $file->move(public_path('images/'), $name);
                    $multi_blog_images[] = $name;
                }
            }
        }

        $blogPost->update([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'author_id' => $request->input('author_id'),
            'images' => implode("|", $multi_blog_images),
            'publication_date' => $request->input('publication_date'),
            'tags' => $request->input('tags'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Blog post updated successfully',
            'blog_post' => $blogPost,
        ]);
    }
}
