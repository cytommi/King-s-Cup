import React from 'react';
import { Helmet } from 'react-helmet';
import ogImage from './assets/images/Kings_Cup.jpg';

const Meta = () => (
  <Helmet>
    <title>King's cup | Play Online Free</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="charset" content="utf-8" />
    <meta
      name="description"
      content="Play the famous drinking game online for free with your friends! No registration required!"
    />
    <meta name="robots" content="index, nofollow" />
    <meta name="og:title" content="Play King's Cup!" />
    <meta
      name="og:description"
      content="Play the famous drinking game online with friends for free. No registration required!"
    />
    <meta name="og:url" content="https://www.cytommigames.com" />
    <meta name="og:type" content="website" />
    <meta name="og:image" content={ogImage} />
  </Helmet>
);

export default Meta;
