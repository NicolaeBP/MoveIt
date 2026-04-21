#include <node_api.h>
#include <linux/uinput.h>
#include <linux/input.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
#include <sys/ioctl.h>
#include <time.h>

static int uinput_fd = -1;

static int emit_event(int fd, int type, int code, int val) {
  struct input_event ie;
  memset(&ie, 0, sizeof(ie));

  struct timespec ts;
  clock_gettime(CLOCK_REALTIME, &ts);
  ie.input_event_sec = ts.tv_sec;
  ie.input_event_usec = ts.tv_nsec / 1000;

  ie.type = type;
  ie.code = code;
  ie.value = val;

  return write(fd, &ie, sizeof(ie)) == sizeof(ie) ? 0 : -1;
}

static napi_value Init(napi_env env, napi_callback_info info) {
  (void)info;
  napi_value result;

  if (uinput_fd >= 0) {
    napi_get_boolean(env, true, &result);
    return result;
  }

  uinput_fd = open("/dev/uinput", O_WRONLY | O_NONBLOCK);
  if (uinput_fd < 0) {
    fprintf(stderr, "uinput: open failed: %s\n", strerror(errno));
    napi_get_boolean(env, false, &result);
    return result;
  }

  if (ioctl(uinput_fd, UI_SET_EVBIT, EV_REL) < 0) {
    fprintf(stderr, "uinput: UI_SET_EVBIT EV_REL failed: %s\n", strerror(errno));
    goto fail;
  }
  if (ioctl(uinput_fd, UI_SET_RELBIT, REL_X) < 0) {
    fprintf(stderr, "uinput: UI_SET_RELBIT REL_X failed: %s\n", strerror(errno));
    goto fail;
  }
  if (ioctl(uinput_fd, UI_SET_RELBIT, REL_Y) < 0) {
    fprintf(stderr, "uinput: UI_SET_RELBIT REL_Y failed: %s\n", strerror(errno));
    goto fail;
  }
  if (ioctl(uinput_fd, UI_SET_EVBIT, EV_SYN) < 0) {
    fprintf(stderr, "uinput: UI_SET_EVBIT EV_SYN failed: %s\n", strerror(errno));
    goto fail;
  }

  struct uinput_setup usetup;
  memset(&usetup, 0, sizeof(usetup));
  usetup.id.bustype = BUS_USB;
  usetup.id.vendor = 0x1234;
  usetup.id.product = 0x5678;
  strcpy(usetup.name, "MoveIt Virtual Mouse");

  if (ioctl(uinput_fd, UI_DEV_SETUP, &usetup) < 0) {
    fprintf(stderr, "uinput: UI_DEV_SETUP failed: %s\n", strerror(errno));
    goto fail;
  }
  if (ioctl(uinput_fd, UI_DEV_CREATE) < 0) {
    fprintf(stderr, "uinput: UI_DEV_CREATE failed: %s\n", strerror(errno));
    goto fail;
  }

  fprintf(stderr, "uinput: device created successfully (fd=%d)\n", uinput_fd);
  usleep(200000);

  napi_get_boolean(env, true, &result);
  return result;

fail:
  close(uinput_fd);
  uinput_fd = -1;
  napi_get_boolean(env, false, &result);
  return result;
}

static napi_value MoveRelative(napi_env env, napi_callback_info info) {
  napi_value result;
  size_t argc = 2;
  napi_value args[2];

  napi_get_cb_info(env, info, &argc, args, NULL, NULL);

  int32_t dx = 0, dy = 0;
  napi_get_value_int32(env, args[0], &dx);
  napi_get_value_int32(env, args[1], &dy);

  if (uinput_fd < 0) {
    napi_get_boolean(env, false, &result);
    return result;
  }

  int ok = 1;
  if (dx != 0) ok = ok && (emit_event(uinput_fd, EV_REL, REL_X, dx) == 0);
  if (dy != 0) ok = ok && (emit_event(uinput_fd, EV_REL, REL_Y, dy) == 0);
  ok = ok && (emit_event(uinput_fd, EV_SYN, SYN_REPORT, 0) == 0);

  napi_get_boolean(env, ok, &result);
  return result;
}

static napi_value Destroy(napi_env env, napi_callback_info info) {
  (void)info;
  napi_value undefined;
  napi_get_undefined(env, &undefined);

  if (uinput_fd >= 0) {
    ioctl(uinput_fd, UI_DEV_DESTROY);
    close(uinput_fd);
    uinput_fd = -1;
  }

  return undefined;
}

static napi_value IsInitialized(napi_env env, napi_callback_info info) {
  (void)info;
  napi_value result;
  napi_get_boolean(env, uinput_fd >= 0, &result);
  return result;
}

static napi_value ModuleInit(napi_env env, napi_value exports) {
  napi_property_descriptor desc[] = {
    {"init", NULL, Init, NULL, NULL, NULL, napi_default, NULL},
    {"moveRelative", NULL, MoveRelative, NULL, NULL, NULL, napi_default, NULL},
    {"destroy", NULL, Destroy, NULL, NULL, NULL, napi_default, NULL},
    {"isInitialized", NULL, IsInitialized, NULL, NULL, NULL, napi_default, NULL},
  };

  napi_define_properties(env, exports, 4, desc);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, ModuleInit)
