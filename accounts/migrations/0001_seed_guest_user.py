from django.contrib.auth.hashers import make_password
from django.db import migrations


def seed_guest_user(apps, schema_editor):
    User = apps.get_model("auth", "User")

    if User.objects.filter(id=1).exists():
        return

    User.objects.create(
        id=1,
        username="guest",
        email="",
        password=make_password(None),
        is_active=True,
    )


def remove_guest_user(apps, schema_editor):
    User = apps.get_model("auth", "User")
    User.objects.filter(id=1, username="guest").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.RunPython(seed_guest_user, remove_guest_user),
    ]
