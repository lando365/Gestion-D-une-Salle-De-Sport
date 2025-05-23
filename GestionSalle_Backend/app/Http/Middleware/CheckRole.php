<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié.',
            ], 401);
        }

        $userRole = $request->user()->role;

        // Si l'utilisateur est admin, il a accès à tout
        if ($userRole === 'admin') {
            return $next($request);
        }

        if (!in_array($userRole, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé pour ce rôle.',
            ], 403);
        }

        return $next($request);
    }
}