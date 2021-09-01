#![allow(non_snake_case)]
use neon::prelude::*;
use bindings::Windows::Win32::{
    Foundation::*,
    UI::{
        WindowsAndMessaging::*,
        KeyboardAndMouseInput::*,
    }
};


#[derive(Debug, Clone, Copy)]
struct Hwnd(HWND);
impl Finalize for Hwnd{}
impl From<HWND> for Hwnd {
    fn from(hwnd: HWND) -> Self {
        Self(hwnd)
    }
}
impl Hwnd{
    pub fn into_inner(self) -> HWND{
        self.0
    }
}

fn getForegroundWindow(mut cx: FunctionContext) -> JsResult<JsBox<Hwnd>> {
    let hwnd = unsafe {
        GetForegroundWindow()
    };
    Ok(cx.boxed(hwnd.into()))
}

fn setForegroundWindow(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let hwnd = cx.argument::<JsBox<Hwnd>>(0)?.into_inner();
    let res = unsafe {
        SetForegroundWindow(hwnd).as_bool()
    };
    Ok(cx.boolean(res))
}

fn getWindowText(mut cx: FunctionContext) -> JsResult<JsString> {
    let hwnd = cx.argument::<JsBox<Hwnd>>(0)?.into_inner();
    if unsafe { GetWindowTextLengthW(hwnd) } <= 0 {
        return Ok(cx.string(""));
    }
    let mut text = [0_u16; 512];
    let len = unsafe { GetWindowTextW(hwnd, PWSTR(text.as_mut_ptr()), text.len() as i32) };
    let title = String::from_utf16_lossy(&text[..len as usize]);
    Ok(cx.string(title))
}

fn key(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let k: String = cx.argument::<JsString>(0)?.value(&mut cx);
    let c: char = match k.chars().take(1).next(){
        Some(c) => c,
        None => return cx.throw_error("empty string")
    };
    match c {
        'A'..='Z' | '0'..='9' => Ok(cx.number(c as u8 as f64)),
        'a'..='z' =>Ok(cx.number((c as u8 )as f64)),
        _ => cx.throw_range_error("out of range")
    }
}

fn input(key: u16, key_up: bool) -> INPUT {
    let mut dwFlags = KEYEVENTF_EXTENDEDKEY;
    if key_up {
        dwFlags |= KEYEVENTF_KEYUP
    }
    INPUT {
        r#type: INPUT_TYPE(1),
        Anonymous: INPUT_0{ ki: KEYBDINPUT{
            wVk: key,
            dwFlags,
            wScan: 0,
            time: 0,
            dwExtraInfo: 0,
        }}
    }
}


fn sendKeys(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let v_js = cx.argument::<JsArray>(0)?.to_vec(&mut cx)?;
    let mut v = Vec::with_capacity(v_js.len());
    for i in v_js.into_iter() {
        v.push(i.downcast_or_throw::<JsNumber,_>(&mut cx)?.value(&mut cx)as u16);
    }
    let mut inputs = Vec::with_capacity(v.len());
    let mut kback = Vec::with_capacity(v.len());
    for k in v.iter() {
        inputs.push(input(*k,false));
        kback.push(input(*k, true));
    }
    inputs.extend(kback.into_iter().rev());
    unsafe {
        SendInput(inputs.len() as u32, inputs.as_mut_ptr(), std::mem::size_of::<INPUT>() as i32);
    }
    Ok(cx.undefined())
}


fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn export_number<T: Into<f64>>(cx: &mut ModuleContext, key: &str, value: T) -> NeonResult<()> {
    let val = cx.number(value);
    cx.export_value(key, val)?;
    Ok(())
}




#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    macro_rules! export_num {
        ($($num:expr),*) => {
            $(export_number(&mut cx, stringify!($num), $num)?;)*
        }
    }
    macro_rules! export_fn {
        ($($f:expr),*) => {
            $(cx.export_function(stringify!($f), $f)?;)*
        }
    }
    export_fn!{
        hello,
        getForegroundWindow,
        setForegroundWindow,
        getWindowText,
        key,
        sendKeys
    }
    export_num!{
        VK_LEFT,
        VK_UP,
        VK_RIGHT,
        VK_DOWN,
        VK_RETURN,
        VK_CONTROL,
        VK_SHIFT
    }
    Ok(())
}
