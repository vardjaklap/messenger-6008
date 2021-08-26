from django.db import models

from . import utils
from .groupchat import Groupchat


class GroupchatMessage(utils.CustomModel):

    text = models.TextField(null=False)
    senderId = models.IntegerField(null=False)
    groupchat = models.ForeignKey(
        Groupchat,
        on_delete=models.CASCADE,
        db_column="groupchatId",
        related_name="groupchatMessages",
        related_query_name="groupchatMessage"
    )
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    # can be changed to represent how many people viewed the message
    # readStatus = models.BooleanField(default = False)