import Document, { Head, Html, Main, NextScript } from 'next/document';

class ULChat extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/** FavIcon */}
          {/** WebFont */}
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

export default ULChat;
