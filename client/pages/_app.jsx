import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const noLayout = ['/login', '/register'];
    const isNoLayoutPage = noLayout.includes(router.pathname);

    return (
        <AuthProvider>
            {isNoLayoutPage ? (
                <Component {...pageProps} />
            ) : (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            )}
        </AuthProvider>
    );
}

export default MyApp;
