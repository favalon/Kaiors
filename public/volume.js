window.addEventListener('message', function(event) {
  // You can add additional checks to verify the source if needed
  if (event.data.volume !== undefined) {
      updateVolume(event.data.volume);
  }
});

function updateVolume(value) {
  // Assuming you have access to LAppLive2DManager in this context
  LAppLive2DManager.getInstance().getModel(0).setVolume(value);
}