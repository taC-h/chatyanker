fn main() {
    windows::build!{
        Windows::Win32::UI::KeyboardAndMouseInput::*,
        Windows::Win32::UI::WindowsAndMessaging::*,
        Windows::Win32::Foundation::*,
    }
}