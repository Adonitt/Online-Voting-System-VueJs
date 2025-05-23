import Swal from "sweetalert2";

export function useAppToast() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    // icona ka me kane success, e message ckado qe na vjen si parameter
    const showSuccess = (message) => {
        Toast.fire({
            icon: 'success',
            title: message,
        })
    }
    const showError = (message) => {
        Toast.fire({
            icon: 'error',
            title: message,
        })
    }
    const showWarning = (message) => {
        Toast.fire({
            icon: 'warning',
            title: message,
        })
    }


    return {showSuccess, showError, showWarning}
}