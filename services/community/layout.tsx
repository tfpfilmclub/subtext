import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'SUBTEXT Reader Community',description:'Reactions and reader comments for SUBTEXT magazine.',icons:{icon:'/favicon.svg'} };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
