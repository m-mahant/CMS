<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'title', 'content', 'author_id', 'images', 'publication_date', 'tags',
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
    ];
    
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}

