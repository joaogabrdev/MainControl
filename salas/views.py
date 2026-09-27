from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
from .models import Salas, RegistroHistorico

@require_GET
def status_sala(request, sala_id):
    sala = get_object_or_404(Salas, id=sala_id)
    
    return JsonResponse({
        'nome': sala.numero,
        'status': sala.status
    })

@require_GET
def status_todas_salas(request):
    salas = Salas.objects.all()
    
    dados_salas = [
        {
            'id': sala.id,
            'nome': sala.numero,
            'status': sala.status
        }
        for sala in salas
    ]
    
    historico = list(RegistroHistorico.objects.values('mensagem', 'criado_em')[:5])
    
    return JsonResponse({
        'salas': dados_salas,
        'historico': historico
    })

@csrf_exempt
def alternar_status(request, sala_id):
    sala = get_object_or_404(Salas, id=sala_id)
    sala.status = not sala.status
    sala.save()

    status_texto = "ABERTA" if sala.status else "FECHADA"
    RegistroHistorico.objects.create(
        mensagem=f"Sala {sala.numero} foi {status_texto}."
    )

    return JsonResponse({'status': sala.status})