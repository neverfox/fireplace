var get        = Ember.get,
    underscore = Ember.String.underscore;

FP.AttributesClassMixin = Ember.Mixin.create({
  attributes: Ember.computed(function() {
    var map = Ember.Map.create();

    this.eachComputedProperty(function(name, meta) {
      if (meta.isAttribute) {
        meta.name = name;
        meta.key  = keyForAttribute(name, meta);
        map.set(name, meta);
      }
    });

    return map;
  }),

  attributesByKey: Ember.computed(function(){
    var map = Ember.Map.create(), key;

    this.eachComputedProperty(function(name, meta) {
      if (meta.isAttribute) {
        meta.name = name;
        meta.key  = key = keyForAttribute(name, meta);
        map.set(key, meta);
      }
    });

    return map;
  }),

  eachAttribute: function(callback, binding) {
    get(this, 'attributes').forEach(function(name, meta) {
      callback.call(binding, name, meta);
    }, binding);
  },

  attributeNameFromKey: function(key) {
    var meta = get(this, 'attributesByKey').get(key);
    return meta && meta.name;
  },

  attributeKeyFromName: function(name) {
    var meta = get(this, 'attributes').get(name);
    return meta && meta.key;
  }
});

FP.AttributesMixin = Ember.Mixin.create({
  eachAttribute: function(callback, binding) {
    this.constructor.eachAttribute(callback, binding);
  },

  attributeNameFromKey: function(key) {
    return this.constructor.attributeNameFromKey(key);
  },

  attributeKeyFromName: function(key) {
    return this.constructor.attributeKeyFromName(key);
  }
});

function keyForAttribute(name, meta) {
  if (meta && meta.options.key) {
    return meta.options.key;
  } else {
    return underscore(name);
  }
}