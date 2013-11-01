/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */
package sparqles.avro.features;  
@SuppressWarnings("all")
@org.apache.avro.specific.AvroGenerated
public class FSingleResult extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  public static final org.apache.avro.Schema SCHEMA$ = new org.apache.avro.Schema.Parser().parse("{\"type\":\"record\",\"name\":\"FSingleResult\",\"namespace\":\"sparqles.avro.features\",\"fields\":[{\"name\":\"query\",\"type\":\"string\"},{\"name\":\"run\",\"type\":{\"type\":\"record\",\"name\":\"Run\",\"namespace\":\"sparqles.avro.performance\",\"fields\":[{\"name\":\"frestout\",\"type\":\"long\"},{\"name\":\"solutions\",\"type\":\"int\"},{\"name\":\"inittime\",\"type\":\"long\"},{\"name\":\"exectime\",\"type\":\"long\"},{\"name\":\"closetime\",\"type\":\"long\"},{\"name\":\"Exception\",\"type\":[\"string\",\"null\"]},{\"name\":\"exectout\",\"type\":\"long\"}]}}]}");
  public static org.apache.avro.Schema getClassSchema() { return SCHEMA$; }
  @Deprecated public java.lang.CharSequence query;
  @Deprecated public sparqles.avro.performance.Run run;

  /**
   * Default constructor.  Note that this does not initialize fields
   * to their default values from the schema.  If that is desired then
   * one should use {@link \#newBuilder()}. 
   */
  public FSingleResult() {}

  /**
   * All-args constructor.
   */
  public FSingleResult(java.lang.CharSequence query, sparqles.avro.performance.Run run) {
    this.query = query;
    this.run = run;
  }

  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call. 
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return query;
    case 1: return run;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
  // Used by DatumReader.  Applications should not call. 
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: query = (java.lang.CharSequence)value$; break;
    case 1: run = (sparqles.avro.performance.Run)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }

  /**
   * Gets the value of the 'query' field.
   */
  public java.lang.CharSequence getQuery() {
    return query;
  }

  /**
   * Sets the value of the 'query' field.
   * @param value the value to set.
   */
  public void setQuery(java.lang.CharSequence value) {
    this.query = value;
  }

  /**
   * Gets the value of the 'run' field.
   */
  public sparqles.avro.performance.Run getRun() {
    return run;
  }

  /**
   * Sets the value of the 'run' field.
   * @param value the value to set.
   */
  public void setRun(sparqles.avro.performance.Run value) {
    this.run = value;
  }

  /** Creates a new FSingleResult RecordBuilder */
  public static sparqles.avro.features.FSingleResult.Builder newBuilder() {
    return new sparqles.avro.features.FSingleResult.Builder();
  }
  
  /** Creates a new FSingleResult RecordBuilder by copying an existing Builder */
  public static sparqles.avro.features.FSingleResult.Builder newBuilder(sparqles.avro.features.FSingleResult.Builder other) {
    return new sparqles.avro.features.FSingleResult.Builder(other);
  }
  
  /** Creates a new FSingleResult RecordBuilder by copying an existing FSingleResult instance */
  public static sparqles.avro.features.FSingleResult.Builder newBuilder(sparqles.avro.features.FSingleResult other) {
    return new sparqles.avro.features.FSingleResult.Builder(other);
  }
  
  /**
   * RecordBuilder for FSingleResult instances.
   */
  public static class Builder extends org.apache.avro.specific.SpecificRecordBuilderBase<FSingleResult>
    implements org.apache.avro.data.RecordBuilder<FSingleResult> {

    private java.lang.CharSequence query;
    private sparqles.avro.performance.Run run;

    /** Creates a new Builder */
    private Builder() {
      super(sparqles.avro.features.FSingleResult.SCHEMA$);
    }
    
    /** Creates a Builder by copying an existing Builder */
    private Builder(sparqles.avro.features.FSingleResult.Builder other) {
      super(other);
      if (isValidValue(fields()[0], other.query)) {
        this.query = data().deepCopy(fields()[0].schema(), other.query);
        fieldSetFlags()[0] = true;
      }
      if (isValidValue(fields()[1], other.run)) {
        this.run = data().deepCopy(fields()[1].schema(), other.run);
        fieldSetFlags()[1] = true;
      }
    }
    
    /** Creates a Builder by copying an existing FSingleResult instance */
    private Builder(sparqles.avro.features.FSingleResult other) {
            super(sparqles.avro.features.FSingleResult.SCHEMA$);
      if (isValidValue(fields()[0], other.query)) {
        this.query = data().deepCopy(fields()[0].schema(), other.query);
        fieldSetFlags()[0] = true;
      }
      if (isValidValue(fields()[1], other.run)) {
        this.run = data().deepCopy(fields()[1].schema(), other.run);
        fieldSetFlags()[1] = true;
      }
    }

    /** Gets the value of the 'query' field */
    public java.lang.CharSequence getQuery() {
      return query;
    }
    
    /** Sets the value of the 'query' field */
    public sparqles.avro.features.FSingleResult.Builder setQuery(java.lang.CharSequence value) {
      validate(fields()[0], value);
      this.query = value;
      fieldSetFlags()[0] = true;
      return this; 
    }
    
    /** Checks whether the 'query' field has been set */
    public boolean hasQuery() {
      return fieldSetFlags()[0];
    }
    
    /** Clears the value of the 'query' field */
    public sparqles.avro.features.FSingleResult.Builder clearQuery() {
      query = null;
      fieldSetFlags()[0] = false;
      return this;
    }

    /** Gets the value of the 'run' field */
    public sparqles.avro.performance.Run getRun() {
      return run;
    }
    
    /** Sets the value of the 'run' field */
    public sparqles.avro.features.FSingleResult.Builder setRun(sparqles.avro.performance.Run value) {
      validate(fields()[1], value);
      this.run = value;
      fieldSetFlags()[1] = true;
      return this; 
    }
    
    /** Checks whether the 'run' field has been set */
    public boolean hasRun() {
      return fieldSetFlags()[1];
    }
    
    /** Clears the value of the 'run' field */
    public sparqles.avro.features.FSingleResult.Builder clearRun() {
      run = null;
      fieldSetFlags()[1] = false;
      return this;
    }

    @Override
    public FSingleResult build() {
      try {
        FSingleResult record = new FSingleResult();
        record.query = fieldSetFlags()[0] ? this.query : (java.lang.CharSequence) defaultValue(fields()[0]);
        record.run = fieldSetFlags()[1] ? this.run : (sparqles.avro.performance.Run) defaultValue(fields()[1]);
        return record;
      } catch (Exception e) {
        throw new org.apache.avro.AvroRuntimeException(e);
      }
    }
  }
}