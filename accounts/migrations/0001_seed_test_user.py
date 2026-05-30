from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_test_user(apps, schema_editor):
    User = apps.get_model("auth", "User")
    User.objects.update_or_create(
        username="testuser",
        defaults={
            "email": "testuser@example.com",
            "password": make_password("password123"),
            "is_active": True,
        },
    )


def delete_test_user(apps, schema_editor):
    User = apps.get_model("auth", "User")
    User.objects.filter(username="testuser").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.RunPython(create_test_user, delete_test_user),
    ]
