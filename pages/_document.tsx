import Document, { Head, Html, Main, NextScript } from 'next/document';

class LerChat extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/** FavIcon */}
          {/** WebFont */}
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='true'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap'
            rel='stylesheet'
          />
          {/** stylesheets */}
          {/** scripts */}
        </Head>
        <body className='bg-dark-chat'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default LerChat;
