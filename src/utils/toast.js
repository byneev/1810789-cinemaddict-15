const SHOW_TIME = 3000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const showToast = () => {
  const toastItem = document.createElement('div');
  toastItem.classList.add('toast-item');
  toastItem.textContent = 'Невозможно выполнить операцию в оффлайн режиме';
  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};

export { showToast };
