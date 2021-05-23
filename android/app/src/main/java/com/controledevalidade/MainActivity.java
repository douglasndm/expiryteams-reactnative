package dev.douglasndm.expirychecker.business;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "expirybusiness";
  }

  // RESPONSAVEL POR PARAR OS TRAVAMENTOS EM PRODUÇÃO QUANDO O USUÁRIO TENTA VOLTA PARA O APLICATIVO
  // DEPOIS DE TER FECHADO ELE
  // https://github.com/software-mansion/react-native-screens/issues/114
  @Override
  protected void onCreate(Bundle savedInstance){
        SplashScreen.show(this, R.style.SplashScreenTheme);
        // super.onCreate(savedInstance);
        super.onCreate(null);
  }
}
