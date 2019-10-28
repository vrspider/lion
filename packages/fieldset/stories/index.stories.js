import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-fieldset.js';
import { localize } from '@lion/localize';
import { isNumberValidator, minLengthValidator } from '@lion/validate';

storiesOf('Forms|Fieldset', module)
  .add(
    'Default',
    () => html`
      <p>
        A native fieldset element should always have a legend-element for a11y purposes. Our
        fieldset element is not native and should not have a legend-element. Our fieldset instead
        has a label attribute or you can add a label with a div- or heading-element using the
        slot="label". Please don't use the the label-element because that is reserved for
        input-elements.
      </p>
      <lion-fieldset name="nameGroup" label="Name">
        <lion-input name="FirstName" label="First Name"></lion-input>
        <lion-input name="LastName" label="Last Name"></lion-input>
      </lion-fieldset>
    `,
  )
  .add(
    'Data',
    () => html`
      <lion-fieldset name="nameGroup" label="Name">
        <lion-input name="FirstName" label="First Name" .modelValue=${'Foo'}></lion-input>
        <lion-input name="LastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
        <button @click=${ev => console.log(ev.target.parentElement.modelValue)}>
          Log to Action Logger
        </button>
      </lion-fieldset>
    `,
  )
  .add('Disabled', () => {
    function toggleDisabled() {
      const fieldset = document.querySelector('#fieldset');
      fieldset.disabled = !fieldset.disabled;
    }
    return html`
      <lion-fieldset name="nameGroup" label="Name" id="fieldset" disabled>
        <lion-input name="FirstName" label="First Name" .modelValue=${'Foo'}></lion-input>
        <lion-input name="LastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
        <lion-fieldset name="nameGroup2" label="Name">
          <lion-input
            name="FirstName2"
            label="First Name"
            .modelValue=${'Foo'}
            disabled
          ></lion-input>
          <lion-input name="LastName2" label="Last Name" .modelValue=${'Bar'}></lion-input>
        </lion-fieldset>
      </lion-fieldset>
      <button @click=${toggleDisabled}>
        Toggle disabled
      </button>
    `;
  })
  .add(
    'Sub Fieldsets Data',
    () => html`
      <lion-fieldset>
        <div slot="label">Personal data</div>
        <lion-fieldset name="nameGroup" label="Name">
          <lion-input name="FirstName" label="First Name" .modelValue=${'Foo'}></lion-input>
          <lion-input name="LastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
        </lion-fieldset>
        <lion-fieldset name="location" label="Location">
          <lion-input name="country" label="Country" .modelValue=${'Netherlands'}></lion-input>
        </lion-fieldset>
        <lion-input name="age" label="Age" .modelValue=${21}></lion-input>
        <button @click=${ev => console.log(ev.target.parentElement.modelValue)}>
          Log to Action Logger
        </button>
        <br />
        <button
          @click=${ev => console.log(ev.target.parentElement.formElements.nameGroup.modelValue)}
        >
          Log nameGroup to Action Logger
        </button>
      </lion-fieldset>
    `,
  )
  .add('Validation', () => {
    const input1IsTen = value => {
      // const error = value.input1 === 'cats' && value.input2 === 'dogs';
      // const suppressError = !document.querySelectorA('[name=input2]').touched;
      return {
        input1IsTen: value.input1 === 'cats' && value.input2 === 'dogs',
      };
    };
    localize.locale = 'en-GB';
    try {
      localize.addData('en-GB', 'lion-validate+input1IsTen', {
        error: {
          input1IsTen: 'Input 1 needs to be "cats" and Input 2 needs to be "dogs"',
        },
      });
    } catch (error) {
      // expected as it's a demo
    }

    return html`
      <lion-fieldset .errorValidators=${[[input1IsTen]]}>
        <lion-input
          name="input1"
          help-text="longer then 2 characters"
          .errorValidators=${[minLengthValidator(3)]}
        ></lion-input>
        <lion-input
          name="input2"
          help-text="longer then 2 characters"
          .errorValidators=${[minLengthValidator(3)]}
        ></lion-input>
      </lion-fieldset>
    `;
  });
