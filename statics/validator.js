const $validate = () => {
    document.getElementById('resetbtn').disabled = ((document.getElementById('password').value !== document.getElementById('confpword').value) || (document.getElementById('password').value === ''));
}

window.onload = setInterval(() => {
    $validate();
}, 500);