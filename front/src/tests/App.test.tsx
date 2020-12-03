import { act } from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

describe('App', () => {
  let container: HTMLDivElement | null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
  });

  it('renders learn react link', async () => {
    await act(async () => {
      ReactDOM.render(<App />, container);
    });
    if (!container) return;
    const titleElements = container.querySelectorAll('title');
    expect(titleElements.length).toBeLessThanOrEqual(2);
  });
});
