from django.db import models
from django.db.models import Q

from . import utils


class Groupchat(utils.CustomModel):

    groupchatName = models.TextField(null=False)
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

