<!-- TITLE/ -->

<h1>redux-saga-process</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/redux-saga-process" title="View this project on NPM"><img src="https://img.shields.io/npm/v/redux-saga-process.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/redux-saga-process" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/redux-saga-process.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/Dash-OS/redux-saga-process" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/Dash-OS/redux-saga-process.svg" alt="Dependency Status" /></a></span>
<span class="badge-travisci"><a href="http://travis-ci.org/Dash-OS/redux-saga-process" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/Dash-OS/redux-saga-process/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-coveralls"><a href="https://coveralls.io/r/Dash-OS/redux-saga-process" title="View this project's coverage on Coveralls"><img src="https://img.shields.io/coveralls/Dash-OS/redux-saga-process.svg" alt="Coveralls Coverage Status" /></a></span>
<span class="badge-paypal"><a href="https://paypal.me/bradynapier" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Encapsulate your Logic into Processes

<!-- /DESCRIPTION -->


### Installation

```
yarn add redux-saga-process@next
```

**or**

```
npm install --save redux-saga-process@next
```

### Example

```js
import { Process } from 'redux-saga-process';

import { call, put, select } from 'redux-saga/effects';

import { createSelector } from 'reselect';

import _ from 'lodash';

const build_config = config => ({
  reduces: 'modal',
  pid: 'modal',
  log: false,
  ...config,
});

// const processLoadsOnAction = 'ACTIVATE_MODALS';

const processInitialState = {
  isOpened: false,
  modalID: undefined,
  modalProps: {},
};

const processActionCreators = {
  modalOpen: ['modalID', 'modalProps'],
  modalClose: ['force'],
};

const processActionRoutes = {
  modalOpen: 'handleModalOpen',
  modalClose: 'handleModalClose',
};

const processReducer = {
  modalState: (state, { type, ...action }) => ({
    ...state,
    ...action,
  }),
};

export default function configureModalsProcess(_config) {
  const config = build_config(_config);

  const processSelectors = {};

  const stateKeySelector = state => state[config.reduces];

  processSelectors.modalProps = createSelector(
    stateKeySelector,
    modal => modal.modalProps,
  );

  processSelectors.modal = createSelector(
    stateKeySelector,
    processSelectors.modalProps,
    (modal, modalProps) => ({
      isOpened: modal.isOpened,
      modalID: modal.modalID,
      modalProps,
    }),
  );

  const processConfig = {
    pid: config.pid,
    reduces: config.reduces,
    wildcard: config.wildcard,
  };

  class ModalsProcess extends Process {
    /**
     * handleModalOpen
     *   Triggered when MODAL_OPEN is dispatched.
     * @arg {ReduxAction}
     *   @param {String} modalID The id of the modal to open
     *   @param {Object} modalProps Optional props for the modal
     */
    *handleModalOpen({ modalID, modalProps }) {
      const modal = yield select(stateKeySelector);
      if (modal.modalID === modalID) {
        // If we try to open a modal which is already opened it will instead
        // be closed
        yield call([this, this.handleModalClose], {}, modal);
      } else {
        yield put({
          type: 'MODAL_STATE',
          isOpened: true,
          modalID,
          modalProps,
        });
      }
    }

    /**
     * handleModalOpen
     *   Triggered when MODAL_OPEN is dispatched.
     * @arg {ReduxAction}
     *   @param {Boolean} force If true, allows closing a modal with isCloseable
     *                          set to false.
     * @arg {Modal}
     *   When called from handleModalOpen, it includes the modal so we don't
     *   need to call the selector a second time.
     */
    *handleModalClose({ force }, _modal) {
      const modal = _modal || (yield select(stateKeySelector));
      if (force !== true && _.get(modal, 'modalProps.isCloseable') === false) {
        if (config.log) {
          return console.info(
            '[modal-process]: Tried to close a modal which is not allowed to close.',
          );
        }
      } else if (_.get(modal, 'modalID') !== undefined) {
        yield put({
          type: 'MODAL_STATE',
          isOpened: false,
          modalID: undefined,
          modalProps: {},
        });
      }
    }

    *processStarts(processID) {
      yield put({
        type: 'PROCESS_STARTS',
        processID,
      });
    }
  }

  return {
    process: ModalsProcess,
    config: processConfig,
    initialState: processInitialState,
    // loadOnAction: processLoadsOnAction,
    actionCreators: processActionCreators,
    actionRoutes: processActionRoutes,
    selectors: processSelectors,
    reducer: processReducer,
  };
}

```

<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/Dash-OS/redux-saga-process/releases">Discover the release history by heading on over to the releases page.</a>

<!-- /HISTORY -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

No maintainers yet! Will you be the first?

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-paypal"><a href="https://paypal.me/bradynapier" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="https://github.com/bradennapier">Braden Napier</a> — <a href="https://github.com/Dash-OS/redux-saga-process/commits?author=bradennapier" title="View the GitHub contributions of Braden Napier on repository Dash-OS/redux-saga-process">view contributions</a></li></ul>



<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://www.dashos.net">Braden R. Napier</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
