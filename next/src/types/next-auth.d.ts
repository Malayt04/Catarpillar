import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth'{
    interface Session{
        user?: {
            _id?: string;
            name?: string;
            email?: string;
        } & DefaultSession['user'] 
    }

    interface User {
        _id?: string;
        name?: string;
        email?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT{
        _id?: string;
        name?: string;
        email?: string;
    }
}