// // src/app/layout.tsx
// import GlobalStyle from '@/styles/global';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <GlobalStyle /> */}
        {children}
      </body>
    </html>
  );
}