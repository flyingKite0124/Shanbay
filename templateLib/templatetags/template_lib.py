from django import template
register=template.Library()

@register.filter
def index(List,index):
    return List[index]