from django.db import models

class Salas(models.Model):
    numero = models.CharField(max_length=20, verbose_name="Número/Nome")
    status = models.BooleanField(default=False, verbose_name="Status da Sala")
    
    class Meta:
        verbose_name = "Sala"
        verbose_name_plural = "Salas"

    def __str__(self):
        return f"Sala {self.numero}"


class RegistroHistorico(models.Model):
    mensagem = models.CharField(max_length=255)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = "Histórico"
        verbose_name_plural = "Históricos"

    def __str__(self):
        return f"{self.criado_em.strftime('%d/%m/%Y %H:%M')} - {self.mensagem}"