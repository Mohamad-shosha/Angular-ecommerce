import { FormControl, ValidationErrors } from '@angular/forms';

export class ShopValidators {
  // whitespace validator
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    const trimmed = control.value?.trim();

    if (trimmed?.length === 0) {
      return { notOnlyWhitespace: true };
    }

    if (trimmed?.length < 2) {
      return { minlength: { requiredLength: 2, actualLength: trimmed.length } };
    }

    return null;
  }
}
