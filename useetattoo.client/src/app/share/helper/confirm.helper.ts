import { custom } from 'devextreme/ui/dialog';
import { CustomButton } from './buttonTypes';

export class ConfirmHelper {
  public static confirm(
    msg: string,
    cbTrue: () => void = (): void => {},
    cbFalse: () => void = (): void => {}
  ): void {
    if (!msg) {
      msg = '';
    }
    custom({
      messageHtml: '<i>' + msg + '</i>',
      title: 'Bestätigen',
      buttons: [CustomButton.yesButton, CustomButton.noButton],
    })
      .show()
      .then((dialogResult: boolean) => {
        if (dialogResult === true) {
          if (cbTrue) {
            cbTrue();
          }
        } else {
          if (cbFalse) {
            cbFalse();
          }
        }
      });
  }

  public static notification(
    msg: string | null,
    cbTrue: () => void = (): void => {}
  ): void {
    if (!msg) {
      msg = '';
    }

    const _toSend: any = {
      messageHtml: '<i>' + msg + '</i>',
      title: 'Erfolgreich!',
      buttons: [CustomButton.okButton],
    }

    custom(_toSend)
      .show()
      .then((dialogResult: boolean) => {
        if (cbTrue) {
          cbTrue();
        }
      });
  }
}
