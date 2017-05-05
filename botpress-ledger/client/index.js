/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react'; // eslint-disable-line
import ReactDOM from 'react-dom';

/* ----------  Local Components  ---------- */

import OutGo from './app.jsx'

/* ----------  Styles  ---------- */

import 'weui';
import 'react-weui/lib/react-weui.min.css';
import '../static/style.css';

// Simple initializer for attaching the Preferences App to the DOM


window.attachOutGo = (userId, Outgo) => {
  /**
   * MessengerExtensions are only available on iOS and Android,
   * so show an error page if MessengerExtensions was unable to start
   */
  if (userId) {
    console.log("")
    const app =  <OutGo />
    ReactDOM.render(app, document.getElementById('content'));
  } else {
    ReactDOM.render("<h1>Oops</h1>", document.getElementById('content'));
  }
};
