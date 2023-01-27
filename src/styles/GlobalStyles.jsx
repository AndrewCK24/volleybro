// Twin uses the same preflight base styles as Tailwind to smooth over cross-browser inconsistencies.
/** The GlobalStyles import adds these base styles along with some @keyframes for the animation classes
 *  and some global css that makes the ring classes and box-shadows work.
 *  https://github.com/ben-rogerson/twin.macro **/

import React from 'react';
import { createGlobalStyle } from 'styled-components';
import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro';

const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: ${theme`colors.purple.500`};
    background-color: #F5F5F5;
    ${tw`antialiased`};
  }
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;