export class ButtonTypes {
  public static default: string = 'default';
  public static success: string = 'success';
  public static action: string = 'action';
  public static warning: string = 'warning';
  public static danger: string = 'danger';
}

export namespace CustomButton {
  export const okButton = {
    text: 'Ok',
    type: 'success',
    icon: 'check',
    width: 100,
    stylingMode: 'outlined',
    onClick: (e: any): boolean => {
      return true;
    },
  } as any;

  export const yesButton = {
    text: 'Ja',
    type: 'success',
    icon: 'check',
    width: 100,
    stylingMode: 'outlined',
    onClick: (e: any): boolean => {
      return true;
    },
  } as any;

  export const noButton = {
    text: 'Nein',
    type: 'danger',
    icon: 'remove',
    width: 100,
    stylingMode: 'outlined',
    onClick: (e: any): boolean => {
      return false;
    },
  } as any;

  export const understandButton = {
    text: 'Verstanden',
    type: 'default',
    stylingMode: 'outlined',
    onClick: (e: any): boolean => {
      return false;
    },
  } as any;
}
