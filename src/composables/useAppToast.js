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
    const showDialog = (
        title = "Are you sure",
        text = "You won't be able to revert this!",
        confirmBtnText = "Yes, delete it!"
        ,) => {
        return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmBtnText
        })
    }


    return {showSuccess, showError, showWarning,showDialog}
}