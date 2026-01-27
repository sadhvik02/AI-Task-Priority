import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${BACKEND_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            alert('Registration successful! Please login.');
            router.push('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Register</h1>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                        minLength={6}
                    />
                    <button type="submit" style={styles.button}>Sign Up</button>
                </form>
                <p style={{ marginTop: '1rem' }}>
                    Already have an account? <Link href="/login" style={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
    },
    card: {
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        marginBottom: '1.5rem',
        fontSize: '2rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4f46e5',
        color: 'white',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: '1rem',
    },
    link: {
        color: '#4f46e5',
        textDecoration: 'none',
        fontWeight: 'bold',
    }
};
