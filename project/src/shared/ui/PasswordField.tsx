import { forwardRef, useState } from 'react';
import type { TextInput } from 'react-native';
 
import { IconButton } from './IconButton';
import { TextField, type TextFieldProps } from './TextField';
 
export const PasswordField = forwardRef<TextInput, TextFieldProps>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);
 
  return (
    <TextField
      ref={ref}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="password"
      textContentType="password"
      leftIcon="lock-closed-outline"
      {...props}
      secureTextEntry={!visible}
      rightElement={
        <IconButton
          icon={visible ? 'eye-off-outline' : 'eye-outline'}
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          size={20}
          onPress={() => setVisible((value) => !value)}
        />
      }
    />
  );
});
