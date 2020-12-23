import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MagicProvider } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MagicProvider publishableAPIKey="pk_test_xxx">hello</MagicProvider>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
