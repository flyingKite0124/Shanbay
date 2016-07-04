#!/usr/bin/python
# coding=utf-8

import sys


class _const:

    class ConstError(TypeError):
        pass

    def __setattr__(self, key, value):
        if key in self.__dict__:
            raise self.ConstError("Can't rebind const ({0})".format(key))
        self.__dict__[key] = value

sys.modules[__name__] = _const()
