import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-input-amount.js';
import { localize } from '@lion/localize';

storiesOf('Forms|Input Amount', module)
  .add(
    'Default',
    () => html`
      <lion-input-amount .errorValidators="${['required']}" label="Amount" .modelValue=${123456.78}>
      </lion-input-amount>
    `,
  )
  .add(
    'Negative number',
    () => html`
      <lion-input-amount
        .errorValidators="${['required']}"
        label="Amount"
        .modelValue=${-123456.78}
      >
      </lion-input-amount>
    `,
  )
  .add(
    'Set USD as currency',
    () => html`
      <lion-input-amount label="Price" currency="USD" .modelValue=${123456.78}> </lion-input-amount>
    `,
  )
  .add(
    'Set JOD as currency',
    () => html`
      <lion-input-amount label="Price" currency="JOD" .modelValue=${123456.78}> </lion-input-amount>
    `,
  )
  .add(
    'Force locale to nl-NL',
    () => html`
      <lion-input-amount
        .formatOptions="${{ locale: 'nl-NL' }}"
        label="Price"
        .modelValue=${123456.78}
        currency="JOD"
      >
      </lion-input-amount>
    `,
  )
  .add(
    'Force locale to en-US',
    () => html`
      <lion-input-amount
        .formatOptions="${{ locale: 'en-US' }}"
        label="Price"
        .modelValue=${123456.78}
        currency="YEN"
      >
      </lion-input-amount>
    `,
  )
  .add(
    'Faulty prefilled',
    () => html`
      <lion-input-amount
        label="Amount"
        help-text="Faulty prefilled input will be cleared"
        .modelValue=${'foo'}
      >
      </lion-input-amount>
    `,
  )
  .add('a', () => {
    const isFake = modelValue => ({ isFake: modelValue.input1 === 10 });
    localize.locale = 'en-GB';

    try {
      localize.addData('en-GB', 'lion-validate+isFake', {
        error: {
          isFake: 'Input 1 needs to be "10"',
        },
      });
    } catch (error) {
      // expected as it's a demo
    }

    return html`
      <lion-fieldset id="test-fieldset1" name="test-fieldset1" .errorValidators=${[[isFake]]}>
        <lion-input-amount name="input1"></lion-input-amount>
      </lion-fieldset>
    `;
  })
  .add('b', () => {
    // function isFake() {
    //   console.log('pow');
    //   return true;
    // }

    const isFake = modelValue => ({ isFake: modelValue === 'cat' });
    localize.locale = 'en-GB';

    // const isFakeValidator = (...factoryParams) => [
    //   (...params) => ({ isFake: isFake(...params) }),
    //   ...factoryParams,
    // ];

    try {
      localize.addData('en-GB', 'lion-validate+isFake', {
        error: {
          isFake: 'You can only use gmail.com email addresses.',
        },
      });
      localize.addData('nl', 'lion-validate+isFake', {
        error: {
          isFake: 'Je mag hier alleen gmail.com e-mailadressen gebruiken.',
        },
      });
    } catch (error) {
      // expected as it's a demo
    }

    return html`
      <lion-fieldset label="fieldset" name="fieldset1" .errorValidators=${[[isFake]]}>
        <lion-input label="input" name="input1" .errorValidators=${[[isFake]]}></lion-input>
      </lion-fieldset>
    `;
  })

  .add(
    'Show no fractions',
    () => html`
      <lion-input-amount
        label="Amount"
        help-text="Prefilled and formatted"
        .formatOptions=${{
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }}
        .modelValue=${20}
      >
      </lion-input-amount>
      <p>
        Make sure to set the modelValue last as otherwise formatOptions will not be taken into
        account
      </p>
    `,
  );
